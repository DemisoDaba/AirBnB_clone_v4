#!/usr/bin/python3
""" Starts a Flash Web Application """

import uuid
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/0-hbnb')
def hbnb():
    """handles request to custom template with states,cities & amentities"""
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amens = storage.all(Amenity).values()
    amens = sorted(amens, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)
    cache_id = str(uuid.uuid4())

    return render_template('0-hbnb.html',
                           states=st_ct,
                           amens=amens,
                           places=places,
                           cache_id=cache_id)


if __name__ == "__main__":
    """ Main Function """
    app.run(host=host, port=port)
