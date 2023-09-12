# DIETPLANR
## Description
DIETPLANR is a brand new platform designed especially for dietitians to connect with their clients and get a better insight on their eating habbits.
### Features:
 Our solution provides areal-time chat using Websocket, 
## Tech Stack: 
### Backend:
- **Django**
- **Django-REST-framework**
- **Django channels**
- **Redis**
- **SQLite3**
### Front-end
- **Javascript**
- **HTML**
- **CSS**
- **Bootstrap**
### Tools:
- **Docker**
- **Pycharm**
- **VS CODE**

## Getting started
download repository using
```bash
git clone https://github.com/Wflikeit/DIETPLANR
```
then download poetry using 
and install all needed dependencies:
```bash
pip poetry install
poetry install
```
then use following commands to run server and redis docker image:
```bash
cd dietplanr
python manage.py runserver
docker run --rm -p 6379:6379 redis:7
```
Now you can enjoy exploring our platform

## Suggestions for a good README
Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.


## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.


## Authors
- says
- say


## Project status
Project is still in development, we are planning to expand a tool for managing and creating recipes features, (we hve got prepared models for recipes, but we don't download it from external API)

## License
For open source projects, say how it is licensed.
