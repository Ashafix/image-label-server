# image-label-server

A simple Flask server with a simple React frontend for manual classification of images.

## Usage
* Create one or more folders, e.g. `cats`, in the same directory as image-label-server.py
* Copy `options.json` and modify it. Labels is an array of possible labels for each folder 
* Add each folder to `FOLDERS` in image-label-server.py
* Copy the images which need to be classified to the folders 
* Start the server with `python image-label-server.py`

## Example
![Screenshot](https://raw.githubusercontent.com/Ashafix/image-label-server/master/readme.png)


## Customization

If you want to run the React app not only on your local computer, modify `const SERVER_URL` in `App.js` and run `npm run build`
`
