![GALogo](ReadMeImages/GALogo.png)

### General Assembly Software Engineering Immersive

#Project 4: Listing

![Homepage](ReadMeImages/WelcomePage.png)

## The Overview:

This was my final project at General Assembly, and I had the flexibility to build any kind web project. The main brief was for it to be a full stack app with a frontend consuming a backend API.

The backend needed to be a Python Flask API, and using this Flask REST Framework to serve my data from a Postgres database. This backend was then to be consumed using a frontend client built with React.

Being inspired by a real-life need for a purchase-tracking app (by my wonderful wife!), I decided to create Listing. This web-app allows you to create individual lists (or boards), and add products to them. I built a custom web-scraper which allows the user to simply provide the product page URL and it will scrape data from the pages' meta tags to improve the UX. Finally, the app also links to the product pages when the user is ready to purchase, and will track whether the purchase has been made.

You can check out the website here: [Listing](https://listingvvtm.herokuapp.com//)

We had the choice of working in groups for this project. However due to the personal nature of the design, and wanting to challenge myself, I opted to work solo on this.

### The Brief

We were given the below brief:

You must:

* **Build a full-stack application** by making your own backend and your own front-end
* **Use a Python Flask API** using a Flask REST Framework to serve your data from a Postgres database
* **Consume your API with a separate front-end** built with React
* **Be a complete product** which most likely means multiple relationships and CRUD functionality for at least a couple of models
* **Implement thoughtful user stories/wireframes** that are significant enough to help you know which features are core MVP and which you can cut
* **Have a visually impressive design** to kick your portfolio up a notch and have something to wow future clients & employers. **ALLOW** time for this.
* **Be deployed online** so it's publicly accessible.


Necessary deliverables are:

* A **working app** hosted on the internet
* A **link to your hosted working app** in the URL section of your Github repo
* A **git repository hosted on Github**, with a link to your hosted project, and frequent commits dating back to the _very beginning_ of the project
* **A `readme.md` file** with:
    * An embedded screenshot of the app
    * Explanations of the **technologies** used
    * A couple paragraphs about the **general approach you took**
    * **Installation instructions** for any dependencies
    * Link to your **user stories/wireframes** – sketches of major views / interfaces in your application, if applicable
    * Descriptions of any **unsolved problems** or **major hurdles** you had to overcome

    
### Technologies Used:

* HTML5
* CSS3
* ES6
* Git
* Github
* React.js
* Node.js
* Python
* Flask
* SQLAlchemy
* Marshmallow
* Postgres
* Psycopg2-binary
* Gazpacho
* Bulma
* Axios
* SASS/SCSS
* bcrypt
* jsonwebtoken
* Insomnia

### Planning:

The first step in planning was to map out the user story, and wireframe it out. This would serve as the foundation for the project and allowed me to build upon it.

![UserStory](ReadMeImages/UserStoryWireframe.png)

From there I was able to think more about and design the relational database, and the models & relationships required. This was also drawn out on a whiteboard to serve as a point of reference.

![BackEnd](ReadMeImages/BackEndWhiteboard.png)

Once both of these had been planned, I set out a list of major tasks/features that I wanted to aim for as an MVP, and as strech goals.

![Checklist](ReadMeImages/Checklist.png)

After the planning was complete, I opted to start with building the backend. This was due to the potential stumbling blocks I might encounter with the relationships, and I really wanted to accomplish some kind of scraper component. After that I would tackle the frontend client and styling.

Initially, I planned to style the app myself without any CSS frameworks as I had used Bulma for the previous two projects and I wanted to challenge myself futher. However, I was unable to as I became very ill midway through the project, and to save time when I recovered I opted to use the framework in which I was familiar with.

## The Backend

Having rigourously planned the backend, I could follow the stucture while building it. 

I started with the models & relationships, and then in order to start testing the backend endpoints using Insomnia I built controllers and serialisers in order to access the models.

### Models & Relationships

Each model extended a simple base model with database columns for ID, and a created_by time, as well as a couple of methods:

```Python
class BaseModel:
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def remove(self):
        db.session.delete(self)
        db.session.commit()
```

The most complex model was the user, as it contained data columns, validation, authentication, as well the widest variety of relationships (many-to-many, one-to-many, self-referential):

```Python
# password strength validation function
def validate_password_strength(password_plaintext):
    assert len(password_plaintext) >= 8, "Password too short"
    return { "messages": "Invalid password" }, 400


class User(db.Model, BaseModel):

    __tablename__ = 'users'
    # data columns
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    image = db.Column(db.Text, nullable=False, default='https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png')
    role = db.Column(db.Enum('normal', 'admin', name='access_types'), default='normal')
    password_hash = db.Column(db.String(128), nullable=True)

    # one-to-many relationships
    products = db.relationship('Product', backref='user')
    boards = db.relationship('Board', backref='user', cascade='all, delete')
    comments = db.relationship('Comment', backref='user')

    # self-referential one-to-many
    messages_sent = db.relationship('Message', backref='sender', lazy='dynamic', foreign_keys = 'Message.sender_id', cascade='all, delete')
    messages_received = db.relationship('Message', backref='recipient', lazy='dynamic', foreign_keys = 'Message.recipient_id', cascade='all, delete')
    
    # self-referential many-to-many
    following = db.relationship(
        'User', lambda: user_following,
        primaryjoin=lambda: User.id == user_following.c.user_id,
        secondaryjoin=lambda: User.id == user_following.c.following_id,
        backref='followers'
    )

    # password hasher
    @hybrid_property
    def password(self):
        pass
    @password.setter
    def password(self, password_plaintext):
        validate_password_strength(password_plaintext)
        encoded_pw = bcrypt.generate_password_hash(password_plaintext)
        self.password_hash = encoded_pw.decode('utf-8')

    # email validator
    @validates('email')
    def validate_email(self, key, address):
        assert '@' and '.' in address, "Invalid email"
        return address

    # password checker + token generator
    def validate_password(self, password_plaintext):
        return bcrypt.check_password_hash(self.password_hash, password_plaintext)

    def generate_token(self):
        payload = {
            "sub": self.id,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(days=7),
        }
        token = jwt.encode(payload, secret, 'HS256')
        return token
```

Generally speaking, most relationships were simple to implement. Specifically the one-to-many relationships (e.g. users with boards they create). However, some relationships were much more complex.

Of these, the self-referential many-to-many relationship (following/followers) was one of the most challenging to implement. It required an additional join table in addition to the above code on the user model (with primary/secondary joins):

```Python
user_following = db.Table('user_following',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('following_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)
```

The most complex relationship to implement however was the many-to-many relationship between products and boards. A join table was not suitable for this, as I also needed to store a "purchased" boolean on the relationship (which would store whether that specific product on a given board was purchased). Therefore, I used a model to join the relationship between the two, which had the additional purchased column:

```Python
class Products_Boards(db.Model):
    _tablename__ = 'products_boards_join',
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'), primary_key=True)
    purchased = db.Column(db.Boolean, default=False)

    product = db.relationship('Product')
```

As the product was the side of the relationship which was "attached" or the "child" to the board, the product relationship was declared on this join model, while on the board model a relatinship was declared to the join model itself:

```Python
products = db.relationship('Products_Boards')
```

### Authentication

I created working authentication through the methods on the user model shown above. When creating a new user, the password hasher (password.setter) would (after validating password stregth) encode the users' password using bcrypt and store the hashed password on the user.

Methods on the model such as validate_password are called to validate the users' password when logging in, again using bcrypt. Finally the method generate_token would create a JSON web token (jwt) by taking the user's ID into the payload, and returning a token assigned to that user only.

The authenication methods can be seen on the below route on the user controller:

```Python
@router.route("/login", methods=["POST"])
def login():
    # look for user in database by filtering using email
    user = User.query.filter_by(email=request.json['email']).first()
    # if user does not exist, send appropriate message in response
    if not user:
        return { 'messages': 'No account found' }, 401
    # if password is incorrect, send appropriate message in response
    if not user.validate_password(request.json['password']):
        return { 'messages': 'Incorrect password' }, 401
    # if user exists and password matches, then generate jwt and send back in response
    token = user.generate_token()
    return { 'token': token, 'messages': f'Welcome back {user.username}!' }
```
The jwt would then be store in the browsers' local storage by the client. This is of course not the most secure method, and could be improved by using e.g. session-based cookies.

### Controllers, Middleware and Serializers

Controllers were relatively straightforward to create, most of which were a matter of providing all or one of a certain type of data with simple error handling, with ID's provided from the client. E.g. boards: 

```Python
@router.route("/board", methods=["GET"])
@secure_route
def get_user_boards():
    boards = Board.query.filter_by(user_id=g.current_user.id)
    return board_schema.jsonify(boards, many=True), 200
    
@router.route("/board/<int:board_id>", methods=["GET"])
def get_single_board(board_id):
    board = Board.query.get(board_id)
    if not board: 
        return { 'messages': 'Board not found' }, 404
    return board_schema.jsonify(board), 200
```

More complicated controllers include marking a specific product as purchased (due to the more complicated relationship): 

```Python
@router.route("/product/<int:product_id>/board<int:board_id>", methods=["PUT"])
@secure_route
def mark_product_purchased(product_id, board_id):
    ## find board in boards table
    board = Board.query.get(board_id)
    if board.user != g.current_user:
        return { 'messages': 'Unauthorized' }, 401
    ## find product on products_boards join table
    product_to_toggle = Products_Boards.query.filter_by(product_id=product_id, board_id=board_id).first()
    if not product_to_toggle:
        return { "messages": "Product not on board" }, 400
    product_to_toggle.purchased = not product_to_toggle.purchased
    db.session.add(product_to_toggle)
    db.session.commit()
    return board_schema.jsonify(board), 200
```

Most controllers had the secure_route middleware wrapper function, which was important in that it checked whether a user was logged in, whether their token was expired, but also it would return the logged in user which could be used in each of the controllers.

```Python
def secure_route(func):
    # wrapper function
    @wraps(func)
    def wrapper(*args, **kwargs):
        # get token and clean
        token_with_bearer = request.headers.get('Authorization')
        token = token_with_bearer.replace("Bearer ", "")
        try: 
            # decode token & find token's user
            payload = jwt.decode(token, secret, 'HS256')
            user_id = payload['sub']
            user = User.query.get(user_id)
            if not user:
                return { "messages": "Unauthorized" }, 401
            g.current_user = user
        except jwt.ExpiredSignatureError: 
             # check if token is expired
             return { "messages": "Session timeout, please log in!" }, 401
        except Exception:
            # catch any errors due to authorization
            return { "messages": "Unauthorized" }, 401
        return func(*args, **kwargs)
    return wrapper
```

Other middleware include a simple logger (used in development), and an error handler which translated and returned useful responses for the most common errors.

Finally, a series of serializers of varying complexity were created using Marshmallow. These were important for the controllers as they created json objects which the controllers could read and also send as reponses.

Some models needed different types of serializer as in some cases less columns were required to be sent in reponses, e.g. user: 

```Python
#larger UserSchema which populates all information inlc. relationships
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash', 'role')
        load_only = ('email, password')

    password = fields.String(required=True)
    boards = fields.Nested('BoardSchema', many=True)
    following = fields.Nested('SimpleUserSchema', many=True)
    followers = fields.Nested('SimpleUserSchema', many=True)
    messages_sent = fields.Nested('MessageSchema', many=True)
    messages_received = fields.Nested('MessageSchema', many=True)

#smaller UserSchema which populates only IDs and usernames.
class SimpleUserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash', 'role', 'email', 'image')
        load_only = ('email, password')
```

### Scraper

A key part of my app was the feature which takes a website URL and is able to scrape data from the page. I really wanted to implement this feature as the UX would be quite clunky if all the data needed to be input by the user. 

After some research, I found a light-weight Python library called Gazpacho (based on BeautifulSoup) which I opted to use. This library is able to fetch the HTML given a URL, and create "Soup". This Soup allows a developer to parse through the HTML, and also has several methods which one can use to navigate & search through the HTML.

Using this library, I built the below program as a controller in my backend. The output of the program is a JSON object which is aligned with my Product model, which a user would need to create a new Product. The below example is only showing one field (product name).

```Python
@router.route("/scrape", methods=["GET"])
def scrape():
    # create soup from url provided in request
    url = request.args.get('url')
    html = get(url)
    soup = Soup(html)
    
    # find product name tag in HTML meta data
    name = (soup.find('meta', attrs={'property': "og:title"}, mode='first'))
    # if name tag is found, then assign the tags content to the variable "name"
    if name != None:
        name = name.attrs['content']
    # if nothing is found, then use the title of the page
    else:
        name = (soup.find('title', mode='first')).text

    # the return statement below returns all variables in a JSON object
    return {
        # in case nothing is found in the scraper, an empty string is provided as the value of that key
        "name": name if name != None else '',
        "description": description if description != None else '',
        "image": image if image != None else '',
        "price": price if price != None else '',
        "vendor": vendor if vendor != None else '',
        "dest_url": url
        }, 200
```

My scraper program is completely dependant on certain meta tags being present on the particular vendors' site, specifically Open Graph tags. The fall-back is to look for other tags with similar names. If a website is poorly tagged, then the scraper would only work for certain fields. However, this provides a good solution to improve the UX of my app, as I will cover later below!

## The Frontend

Once the backend had been set-up, seeded, and end-points were tested, I proceeded with creation of the frontend client built in React.

As the main user story was determined during planning, I had a structure to follow when creating all required pages. 

In addition, while I had created many different end-points on my backend, I focussed on only connecting to those required as I worked through the different pages and sections of the app.

### Login/Register



...

MORE TO COME!