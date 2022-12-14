# React File Server

<img src="./docs/preview.png" height="400px" width="400px" />

## Setup

**This project requires the [Python Web Server](https://github.com/connorturlan/web-server-py) project to run.** By default it includes the file server module.

Clone to repo and install all dependencies with:

`npm i`

Then you can run the program locally with:

`npm run dev`

## MVP

Create a front-end interface for the Python Web Server using React.

The app should:

-   Allow a user to download, and upload files/folders on a remote file system.
-   Provide basic functionality to copy and move files on the remote file system.
-   Provide navigation features for folders in the system.
-   Provide a preview of supported file types within the browser before download.
-   Allow to user to rename files.
-   Provide various views for files, eg. grid, list, etc.
-   Be responsive and be usable across a range of devices.

## Implementation

.env is required in the root dir with the parameters `HOST_URL` and `HOST_PORT`.

## Known Issues

-   Use isn't alerted when there is an error with the requested copy/move/rename.

## Retrospective

## Future Plans

-   Add photo/video modals.
-   Show current path in file system.

### Potentially

-   Show a breadcrumb trail.
-   Flesh out upload dialog.

## Related Projects

-   [Python Web Server](https://github.com/connorturlan/web-server-py) - A File Server host that this project was build to work around.

## License

CC by attribution non-commercial, derivatives allowed.

## Contributions

Made by Connor Turlan 2022.
