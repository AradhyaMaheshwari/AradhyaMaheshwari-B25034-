# Challenge 4 - The Bakery’s Secret Recipe
## Objective
The objective of this task was to investigate a directory discovered on a public-facing server and determine whether it contained any hidden or sensitive information. Although the folder appeared to belong to a small internal bakery project, it was suspected that the directory might expose confidential data if analyzed carefully.

The main goal was to inspect the files, analyze the Git repository present in the folder, and recover any hidden flags following the format:

SAIC{REDACTED_FLAG}

## Linux-commands Used
- 'ls' - Lists files and directories in the current location.
- 'pwd" - Prints the current working directory.
- 'ls -la' - Lists files and directories in the current location.
- 'tar -xvzf chall6.tar.gz' - Extracts the contents of a gzip-compressed tar archive.
- 'cat baked_goods.txt' - Displays the encrypted numerical contents of the file.
- 'git log --oneline --all' - Displays a concise list of all commits across all branches.
- 'git fsck --full' - Checks the Git repository for integrity and reveals dangling commits.
- 'git show <commit_hash>:baked_goods.txt' - Retrieves a deleted file from a specific Git commit.
