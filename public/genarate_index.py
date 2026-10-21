
#!/usr/bin/env python3

import hashlib
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PACKAGES_DIR = ROOT / "packages"
INDEX_FILE = ROOT / "index.json"

# The Git repository is the parent of public/
GIT_ROOT = ROOT.parent

REPOSITORY_NAME = "lunareth"
SCHEMA_VERSION = 2
REPOSITORY_DESCRIPTION = "Official Lunareth package repository"
BASE_URL = "https://lunareth-repo.pages.dev/"
COMMIT_MESSAGE = "repository update"


def run_command(command, cwd=ROOT):
    """Run a command and report errors clearly."""
    print(f"$ {' '.join(map(str, command))}")

    try:
        subprocess.run(
            command,
            cwd=cwd,
            check=True,
        )
    except subprocess.CalledProcessError as error:
        raise RuntimeError(
            f"Command failed with exit code {error.returncode}: "
            f"{' '.join(map(str, command))}"
        ) from error
    except OSError as error:
        raise RuntimeError(
            f"Could not execute {command[0]}: {error}"
        ) from error


def rpm_query(package, tag):
    """Read one metadata field from an RPM."""
    result = subprocess.run(
        [
            "rpm",
            "-qp",
            "--queryformat",
            f"%{{{tag}}}",
            str(package),
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    return result.stdout.strip()


def rpm_list(package, tag):
    """Read list-valued RPM metadata."""
    result = subprocess.run(
        [
            "rpm",
            "-qp",
            "--queryformat",
            f"[%{{{tag}}}\\n]",
            str(package),
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    return sorted({
        line.strip()
        for line in result.stdout.splitlines()
        if line.strip() and line.strip() != "(none)"
    })


def sha256_file(package):
    """Calculate SHA-256 without loading the entire RPM."""
    digest = hashlib.sha256()

    with package.open("rb") as file:
        for chunk in iter(
            lambda: file.read(1024 * 1024), b""
        ):
            digest.update(chunk)

    return digest.hexdigest()


def generate_package_entry(package):
    """Build a repository entry from an RPM."""
    name = rpm_query(package, "NAME")
    version = rpm_query(package, "VERSION")
    release = rpm_query(package, "RELEASE")
    architecture = rpm_query(package, "ARCH")
    description = rpm_query(package, "SUMMARY")
    license_name = rpm_query(package, "LICENSE")

    required_fields = {
        "name": name,
        "version": version,
        "release": release,
        "architecture": architecture,
    }

    for field, value in required_fields.items():
        if not value or value == "(none)":
            raise ValueError(
                f"RPM is missing required field: {field}"
            )

    if "/" in name or "\\" in name:
        raise ValueError(f"Invalid RPM package name: {name}")

    entry = {
        "name": name,
        "version": version,
        "release": release,
        "architecture": architecture,
        "filename": package.name,
        "file": package.relative_to(ROOT).as_posix(),
        "description": (
            description
            if description and description != "(none)"
            else name
        ),
        "license": (
            license_name
            if license_name and license_name != "(none)"
            else "Unknown"
        ),
        "size": package.stat().st_size,
        "sha256": sha256_file(package),
        "dependencies": rpm_list(package, "REQUIRENAME"),
        "provides": rpm_list(package, "PROVIDENAME"),
        "conflicts": rpm_list(package, "CONFLICTNAME"),
    }

    return name, entry


def write_index_atomically(index):
    """Replace the index only after a complete successful write."""
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=ROOT,
            delete=False,
            suffix=".tmp",
        ) as temp_file:
            temp_path = Path(temp_file.name)

            json.dump(
                index,
                temp_file,
                indent=2,
                sort_keys=True,
            )
            temp_file.write("\n")
            temp_file.flush()
            os.fsync(temp_file.fileno())

        # Validate the generated file before replacing the old index.
        with temp_path.open("r", encoding="utf-8") as file:
            validated = json.load(file)

        if validated.get("schema_version") != SCHEMA_VERSION:
            raise ValueError("Generated index has an invalid schema")

        if not isinstance(validated.get("packages"), dict):
            raise ValueError("Generated index has invalid packages")

        temp_path.replace(INDEX_FILE)
        temp_path = None

    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


def update_git_repository():
    """Stage changes, commit when needed, and push."""
    if not (GIT_ROOT / ".git").exists():
        raise RuntimeError(
            f"Git repository not found at {GIT_ROOT}"
        )

    # Stage all changes from the repository root, as requested.
    run_command(["git", "add", "."], cwd=GIT_ROOT)

    # Avoid failing when there is nothing new to commit.
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        cwd=GIT_ROOT,
        check=False,
    )

    if result.returncode == 0:
        print("\nNo staged changes to commit.")
    elif result.returncode == 1:
        run_command(
            ["git", "commit", "-m", COMMIT_MESSAGE],
            cwd=GIT_ROOT,
        )
    else:
        raise RuntimeError(
            "Could not check staged Git changes"
        )

    # Push even if everything was already committed.
    run_command(["git", "push"], cwd=GIT_ROOT)


def main():
    if not PACKAGES_DIR.is_dir():
        raise SystemExit(
            f"Error: package directory not found: {PACKAGES_DIR}"
        )

    rpm_files = sorted(PACKAGES_DIR.rglob("*.rpm"))

    if not rpm_files:
        raise SystemExit(
            "Error: no RPM files found; existing index was preserved"
        )

    packages = {}

    print("=== Lunareth repository builder ===\n")

    for rpm_file in rpm_files:
        try:
            name, entry = generate_package_entry(rpm_file)

            if name in packages:
                previous = packages[name]["file"]
                raise ValueError(
                    f"duplicate package name '{name}' "
                    f"in {previous} and {entry['file']}"
                )

            packages[name] = entry

            print(
                f"  indexed {name} "
                f"{entry['version']}-{entry['release']} "
                f"({entry['architecture']})"
            )

        except (
            subprocess.CalledProcessError,
            ValueError,
            OSError,
        ) as error:
            raise SystemExit(
                f"\nError reading {rpm_file.name}: {error}\n"
                "Git was not updated."
            ) from error

    index = {
        "name": REPOSITORY_NAME,
        "schema_version": SCHEMA_VERSION,
        "repository": {
            "description": REPOSITORY_DESCRIPTION,
            "base_url": BASE_URL,
        },
        "packages": packages,
    }

    try:
        write_index_atomically(index)
    except (OSError, ValueError) as error:
        raise SystemExit(
            f"Error generating index: {error}\n"
            "Git was not updated."
        ) from error

    print(f"\nIndex generated: {INDEX_FILE}")
    print(f"Packages indexed: {len(packages)}")
    print(f"Schema version: {SCHEMA_VERSION}")

    print("\n=== Updating Git repository ===\n")

    try:
        update_git_repository()
    except RuntimeError as error:
        raise SystemExit(
            f"\nGit update failed: {error}\n"
            "The generated index remains on disk."
        ) from error

    print("\n=== Lunareth repository update complete ===")
    print("Index generated, changes committed if needed, push completed.")


if __name__ == "__main__":
    main()
