# Movie-Database-Application

key takeways: 

use of react query :
using react query helped me keep the movie data form by backend database fresh. 
when manipulating the movie database, using react query used the cached "stale" data to keep the site running in a non-loading state while background processes were running
made getting movie data from background routes easy and optimized

use of custom hooks: 
custom hooks helped me consolidate repetitive movie fetch logic and authorization checks into custom hooks which I called in my various components. 

I should have consolidated movie rental and watchlist fetching into a custom hook as well but I did not have time

user authorization with passport and custom jwt tokens : 
I used passport for google auth and also gave users the option to sign in with custom emails and would assign custom jwt tokens
both forms of authorization were validated using express middlewear and user information was received using a /profile route
bcrypt and password hashing

movie rental process : 
sign in ---> generate customer ovbject -----> take movie object and customer obj adn embed them to a rental obj. ---> assign a reference to rental in user schema

all data preserved in mongoDB







