# DIETPLANR
## Description
DIETPLANR is a brand new platform designed especially for dietitians to connect with their clients and get a better insight on their eating habbits.
### Features:
 * Real-time chat using Websocket,
 * Interactive calendar,
 * Making appointments,
 * Personalize recipes,
 * Personalize your profile,
 <!-- * insight on user activity  -->
## Tech Stack: 
### Backend:
> **Django,**
> **Django-REST-framework,**
> **Django channels,**
> **Redis,**
> **SQLite3**
### Front-end
> **Javascript,**
> **Fetch API,**
> **HTML,**
> **CSS,**
### Tools:
> **Docker,**
> **Pycharm,**
> **VS CODE**

## Getting started
download repository using
```bash
git clone https://github.com/Wflikeit/DIETPLANR
```
### If you have poetry:
install all needed dependencies:
```bash
poetry install
```
### If not install requirements from requirements.txt:
```bash
pip install -r requirements.txt
```

## Then:
Use following commands to run server and redis docker image:
```bash
cd dietplanr
python manage.py runserver
docker run --rm -p 6379:6379 redis:7
```
Now you can enjoy exploring our platform

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.


## Incoming change
Our next steps to make our app even more exceptional
will be:
- finishing integration with external API for recipes
- improve the design of our landing page,
- improve the view of user profile,
- improve performance
- use PostgreSQL instead of SQLite3
- make some custom signals
- introduce MessageBroker for asynchronously sending notifications 


## Authors
* <a href="https://github.com/avrgprogrammer741">avrgprogrammer741</a>
* <a href="https://github.com/Wflikeit">Wflikeit<a>


<!-- ## Project status
Project is still in development, we are planning to expand a tool for managing and creating recipes features, (we hve got prepared models for recipes, but we don't download it from external API) -->

## License
DIETPLANR is an open-source project licensed under the MIT License.
