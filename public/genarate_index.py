
#!/usr/bin/env python3

import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PACKAGES_DIR = ROOT / "packages"
INDEX_FILE = ROOT / "index.json"

REPOSITORY_NAME = "lunareth"
REPOSITORY_VERSION = "1"


def rpm_query(package, tag):
    """Read one metadata field from an RPM file."""
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
    """Read a list-valued RPM metadata field."""
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

    return [
        line.strip()
        for line in result.stdout.splitlines()
        if line.strip()
    ]


def generate_package_entry(package):
    name = rpm_query(package, "NAME")
    version = rpm_query(package, "VERSION")
    release = rpm_query(package, "RELEASE")
    architecture = rpm_query(package, "ARCH")
    description = rpm_query(package, "SUMMARY")
    license_name = rpm_query(package, "LICENSE")
    size_bytes = int(rpm_query(package, "SIZE") or "0")

    # Use the actual RPM filename for the download URL
    relative_file = package.relative_to(ROOT).as_posix()

    # SHA-256 lets clients verify downloaded package bytes
    digest = hashlib.sha256(package.read_bytes()).hexdigest()

    entry = {
        "version": version,
        "file": relative_file,
        "architecture": architecture,
        "description": description,
        "license": license_name,
        "size": size_bytes,
        "release": release,
        "sha256": digest,
        "dependencies": rpm_list(package, "REQUIRENAME"),
    }

    return name, entry


def main():
    if not PACKAGES_DIR.is_dir():
        raise SystemExit(
            f"Error: package directory not found: {PACKAGES_DIR}"
        )

    rpm_files = sorted(PACKAGES_DIR.rglob("*.rpm"))

    if not rpm_files:
        raise SystemExit(
            "Error: no RPM files found; existing index was not changed"
        )

    packages = {}

    for rpm_file in rpm_files:
        try:
            name, entry = generate_package_entry(rpm_file)

            if name in packages:
                raise ValueError(
                    f"duplicate package name: {name}"
                )

            packages[name] = entry
            print(f"  indexed {name} {entry['version']}")

        except (
            subprocess.CalledProcessError,
            ValueError,
            OSError,
        ) as error:
            raise SystemExit(
                f"Error reading {rpm_file.name}: {error}\n"
                "Index was not changed"
            ) from error

    index = {
        "name": REPOSITORY_NAME,
        "version": REPOSITORY_VERSION,
        "packages": packages,
    }

    # Write to a temporary file first, then replace the index
    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        dir=ROOT,
        delete=False,
        suffix=".tmp",
    ) as temp_file:
        temp_path = Path(temp_file.name)

        json.dump(index, temp_file, indent=2)
        temp_file.write("\n")

    try:
        temp_path.replace(INDEX_FILE)
    finally:
        temp_path.unlink(missing_ok=True)

    print(f"\nGenerated {INDEX_FILE}")
    print(f"Indexed {len(packages)} package(s)")


if __name__ == "__main__":
    main()
