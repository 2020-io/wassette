# Release Process

This document describes the process for releasing new versions of the Wassette project.

## Release.yml overview

The release process is automated using GitHub Actions, specifically the [`release.yml`](.github/workflows/release.yml) workflow. This workflow is triggered when a new tag is pushed to the repository. Once triggered, the workflow uses a matrix to compile `wassette` for different platforms on native runners and uses `sccache` to speed up the compilation process by caching previous builds. The compiled binaries are then uploaded as artifacts to the release.

## Release Versioning

Wassette uses semantic versioning. All releases follow the format `vX.Y.Z`, where X is the major version, Y is the minor version, and Z is the patch version.

## Tagging Strategy

- All release tags are prefixed with v, e.g., v0.10.0.
- Tags are created on the default branch (typically main), or on a release branch when applicable.
- Patch releases increment the Z portion, e.g., v0.6.1 → v0.6.2.
- Minor releases increment the Y portion, e.g., v0.9.0 → v0.10.0.

## Steps to Cut a Release

1. **Update the version**: Before creating a release, ensure that the version number in the `Cargo.toml` file is updated to reflect the new release version. This should follow semantic versioning.

   For example, if the current version is `0.1.0` and you are releasing a patch, update it to `0.1.1`.

   ```toml
   [package]
   name = "wassette"
   version = "0.1.1" # Update this line
   ```

   ```bash
   # commit the version change
   git add Cargo.toml
   git commit -m "Bump version to 0.1.1"
   ```

   ```bash
   # push the changes to the release branch
   git push origin <branch_name>
   ```

1. **Open a Pull Request to main**: Create a pull request to merge the changes into the main branch. This allows for code review and ensures that the version bump is properly documented.

1. **Create a new tag**: Once the pull request is merged, create a new tag for the release. The tag should follow the semantic versioning format and be prefixed with `v`.

   ```bash
   # Checkout the main branch and pull the latest changes
   git checkout main
   git pull origin main

   # Create a new tag
   git tag -s <tag_name> -m "Release <tag_name>" # e.g., v0.1.0
   git push origin <tag_name> # e.g., v0.1.0
   ```

1. **Trigger the release workflow**: Once the tag is pushed, the `release.yml` workflow will be triggered automatically. You can monitor the progress of the workflow in the "Actions" tab of the GitHub repository. After the workflow completes successfully, the compiled binaries for each platform will be available for download in the "[Releases](https://github.com/microsoft/wassette/releases)" section of the GitHub repository.

1. **Update package manifests**: After all release assets are published, refresh the downstream package managers so they point at the new version.

   - **WinGet**:
     1. Open the GitHub release for the new tag and use the asset menu to copy the download URL and SHA-256 value for each Windows zip (`wassette_<version>_windows_amd64.zip` and `wassette_<version>_windows_arm64.zip`).
     1. Edit `winget/Microsoft.Wassette.yaml` and update `PackageVersion`, `ReleaseDate`, `InstallerUrl`, and `InstallerSha256` for each architecture using the copied values.
     1. Submit the manifest changes in a pull request.

   - **Homebrew**:
     1. From the same GitHub release, copy the SHA-256 values for each tarball referenced in `Formula/wassette.rb` (`wassette_<version>_darwin_amd64.tar.gz`, `wassette_<version>_linux_amd64.tar.gz`, etc.).
     1. Update the `version` field and the `sha256` values in `Formula/wassette.rb` to match the new release assets.
     1. Open a pull request with the Formula update.
