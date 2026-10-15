#!/usr/bin/env python3

import hashlib
import json
import os
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PACKAGES_DIR = ROOT / "packages"
INDEX_FILE = ROOT / "index.json"

REPOSITORY_NAME = "lunareth"
SCHEMA_VERSION = 2
REPOSITORY_DESCRIPTION = "Official Lunareth package repository"
BASE_URL = "https://lunareth-repo.pages.dev/"


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
    """Build one repository entry from an RPM package."""
    name = rpm_query(package, "NAME")
    version = rpm_query(package, "VERSION")
    release = rpm_query(package, "RELEASE")
    architecture = rpm_query(package, "ARCH")
    description = rpm_query(package, "SUMMARY")
    license_name = rpm_query(package, "LICENSE")
    size_bytes = package.stat().st_size

    if not name or not version or not architecture:
        raise ValueError("RPM is missing required metadata")

    relative_file = package.relative_to(ROOT).as_posix()
    digest = hashlib.sha256(package.read_bytes()).hexdigest()

    entry = {
        "name": name,
        "version": version,
        "release": release,
        "architecture": architecture,
        "filename": package.name,
        "file": relative_file,
        "description": description,
        "license": license_name,
        "size": size_bytes,
        "sha256": digest,
        "dependencies": rpm_list(package, "REQUIRENAME"),
        "provides": rpm_list(package, "PROVIDENAME"),
        "conflicts": rpm_list(package, "CONFLICTNAME"),
    }

    return name, entry


def write_index_atomically(index):
    """Write the complete index before replacing the old one."""
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
            json.dump(index, temp_file, indent=2, sort_keys=True)
            temp_file.write("\n")
            temp_file.flush()
            os.fsync(temp_file.fileno())

        temp_path.replace(INDEX_FILE)

    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


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
                raise ValueError(f"duplicate package name: {name}")

            packages[name] = entry
            print(
                f"  indexed {name} "
                f"{entry['version']}-{entry['release']}"
            )

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
        "schema_version": SCHEMA_VERSION,
        "repository": {
            "description": REPOSITORY_DESCRIPTION,
            "base_url": BASE_URL,
        },
        "packages": packages,
    }

    write_index_atomically(index)

    print(f"\nGenerated {INDEX_FILE}")
    print(f"Indexed {len(packages)} package(s)")
    print(f"Schema version: {SCHEMA_VERSION}")


if __name__ == "__main__":
    main()
