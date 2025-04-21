DROP TYPE IF EXISTS seat_type_enum ;
DROP TYPE IF EXISTS screen_type_enum ;
DROP TYPE IF EXISTS card_type_enum ;
DROP TYPE IF EXISTS admin_role_enum ;
DROP TYPE IF EXISTS permission_enum ;

CREATE TYPE seat_type_enum as ENUM ('Premium', 'Regular');
CREATE TYPE screen_type_enum as ENUM ('SDR', '4K-HDR', 'IMAX', '3D');
CREATE TYPE card_type_enum as ENUM ('Debit', 'Credit');
CREATE TYPE admin_role_enum as ENUM ('Employee', 'Supervisor', 'Manager');
CREATE TYPE permission_enum as ENUM ('Theatre Management', 'Comment Management', 'Movie Listing Management');

CREATE TABLE COMPANY(
Company_name					VARCHAR(30)				NOT NULL,
Location						VARCHAR(255)				NOT NULL,
Phone_number					VARCHAR(15),				
PRIMARY KEY (Company_name));

CREATE TABLE THEATRE(
Location						VARCHAR(255)				NOT NULL,
Phone_number					VARCHAR(15)				NOT NULL,
Company_name					CHAR(30)				NOT NULL,
PRIMARY KEY (Location),					
FOREIGN KEY (Company_name) REFERENCES COMPANY(Company_name)
);

CREATE TABLE AUDITORIUM(
Theatre_location					VARCHAR(30)				            NOT NULL,
Number						        INT					                NOT NULL,
Seat_type						    seat_type_enum          			NOT NULL,
SCREEN_TYPE					        screen_type_enum                	NOT NULL,
Movie_name					        VARCHAR(30)				            NOT NULL,
PRIMARY KEY (Theatre_location, Number),
FOREIGN KEY (Theatre_location) REFERENCES THEATRE(Location)
);

CREATE TABLE SEAT(
Theatre_location					VARCHAR(30)				NOT NULL,
Auditorium_number					INT					    NOT NULL,
Seat_id						        INT					    NOT NULL,
Number						        INT					    NOT NULL,
Row						            INT					    NOT NULL,
Status						        BOOLEAN					NOT NULL,
PRIMARY KEY (Theatre_location, Auditorium_number, Seat_id),
FOREIGN KEY (Theatre_location) REFERENCES THEATRE(Location),
FOREIGN KEY(Theatre_location, Auditorium_number) REFERENCES AUDITORIUM(Theatre_location, Number)
);

CREATE TABLE PAYMENT(
Payment_id					INT 					    NOT NULL    UNIQUE,
Card_number					INT 					    NOT NULL,
Ticket_id					INT 					    NOT NULL,
Customer_id					INT					        NOT NULL,
Status						BOOLEAN					    NOT NULL,
Date						TIMESTAMP                   NOT NULL,
PRIMARY KEY (Payment_id, Card_number, Ticket_id, Customer_id)
);

CREATE TABLE PAYPAL(
Payment_id					    INT 					    NOT NULL,
Email_address					VARCHAR(255)				NOT NULL,
Password						VARCHAR(255)				NOT NULL,
Phone_number					VARCHAR(15),
PRIMARY KEY (Payment_id),
FOREIGN KEY (Payment_id) REFERENCES PAYMENT(Payment_id)
);

CREATE TABLE CARD(
Payment_id					INT 					    NOT NULL,
Expiration_date				DATE    				    NOT NULL,
Card_type					card_type_enum      		NOT NULL,
CVV						    INT 					    NOT NULL,
Card_holder					CHAR(15)					NOT NULL,
PRIMARY KEY (Payment_id)
);

CREATE TABLE CUSTOMER(
Customer_id					    BIGSERIAL,
First_name					    VARCHAR(30)			NOT NULL,
Last_name						VARCHAR(30)			NOT NULL,
Email_address					VARCHAR(255)		NOT NULL,
Username						VARCHAR(30)			NOT NULL UNIQUE,
Phone_number					VARCHAR(15)			NOT NULL UNIQUE,
Password						VARCHAR(255)		NOT NULL,
Ticket_id						INT 				        ,
PRIMARY KEY (Customer_id)
);

CREATE TABLE REGULAR(
Ticket_id						INT					    NOT NULL,
Purchase_date					DATE					NOT NULL,
Recliner_seat					BOOLEAN					NOT NULL,
Price						    INT					    NOT NULL,
Movie_time					    TIME,			
Theatre_location				VARCHAR(30)				NOT NULL,
Auditorium_number				INT 					NOT NULL,
Seat_ID						    INT					    NOT NULL,
Payment_id					    INT 					NOT NULL,
Customer_id					    INT					    NOT NULL,
Card_number					    INT 					NOT NULL,
PRIMARY KEY (Ticket_id),
FOREIGN KEY (Theatre_location) REFERENCES THEATRE(Location),
FOREIGN KEY(Theatre_location, Auditorium_number) REFERENCES AUDITORIUM(Theatre_location, Number),
FOREIGN KEY (Theatre_location, Auditorium_number, Seat_ID) REFERENCES SEAT(Theatre_location, Auditorium_number, Seat_id),
FOREIGN KEY (Payment_id) REFERENCES PAYMENT(Payment_id),
FOREIGN KEY (Customer_id) REFERENCES CUSTOMER(Customer_id)
);

CREATE TABLE PREMIUM(
Ticket_id						INT 					            NOT NULL,
Price						    INT					                NOT NULL,
Movie_time					    TIME,					
Purchase_date					DATE					            NOT NULL,
Screen_type					    screen_type_enum                    NOT NULL,
Seat_type						seat_type_enum          			NOT NULL,
Theatre_location				VARCHAR(30)				            NOT NULL,
Auditorium_number				INT 					            NOT NULL,
Seat_id						    INT					                NOT NULL,
Payment_id					    INT 					            NOT NULL,
Customer_id					    INT					                NOT NULL,
Card_number					    INT 					            NOT NULL,
PRIMARY KEY (Ticket_id),
FOREIGN KEY (Theatre_location) REFERENCES THEATRE(Location),
FOREIGN KEY (Theatre_location, Auditorium_number) REFERENCES AUDITORIUM(Theatre_location, Number),
FOREIGN KEY (Theatre_location, Auditorium_number, Seat_ID) REFERENCES SEAT(Theatre_location, Auditorium_number, Seat_id),
FOREIGN KEY (Payment_id) REFERENCES PAYMENT(Payment_id),
FOREIGN KEY (Customer_id) REFERENCES CUSTOMER(Customer_id)
); 

CREATE TABLE ADMIN(
Admin_Id					INT					                            NOT NULL,
Role						admin_role_enum                         		NOT NULL,
Permissions		            permission_enum	                                NOT NULL,
Username					VARCHAR(30)                                     NOT NULL,				
Phone_number				VARCHAR(15)				                        NOT NULL,
Password					VARCHAR(255)				                    NOT NULL,
PRIMARY KEY (Admin_Id)				
);


CREATE TABLE USER_RATING(
Comment_id					INT 					NOT NULL,
Date						DATE		            NOT NULL,
Movie_name					VARCHAR(30)				NOT NULL,
Username					VARCHAR(30)				NOT NULL,
Rating						VARCHAR(255),				
PRIMARY KEY (Comment_id)
);


CREATE TABLE MOVIE( 
Name						VARCHAR(255)				NOT NULL,	
Movie_id        INT                 NOT NULL,	
Genre						VARCHAR(15)				NOT NULL,		
PG_rating					VARCHAR(30)				NOT NULL,		
Release_date				DATE					NOT NULL,
Description					VARCHAR(1000)			NOT NULL,
Duration					TIME				    NOT NULL,		
End_time					TIME,			
Start_time					TIME,				
PRIMARY KEY (Name)
);

CREATE TABLE MOVIE_ACTOR(
Name						VARCHAR(30)				NOT NULL,		
Actor						VARCHAR(30)				NOT NULL,
PRIMARY KEY (Name, Actor),
FOREIGN KEY (Name) REFERENCES MOVIE(Name)
);

CREATE TABLE REQUEST(
Customer_id					INT					    NOT NULL,
Movie_name					VARCHAR(30)				NOT NULL,
PRIMARY KEY (Customer_id, Movie_name),		
FOREIGN KEY (Customer_id) REFERENCES CUSTOMER(Customer_id),
FOREIGN KEY (Movie_name) REFERENCES MOVIE(Name)
);

CREATE TABLE MONITOR(
Comment_id					    INT 			NOT NULL,
Admin_id						INT				NOT NULL,
Theatre_location				VARCHAR(30)		NOT NULL,
PRIMARY KEY (Comment_id, Admin_id, Theatre_location),
FOREIGN KEY (Comment_id) REFERENCES USER_RATING(Comment_id),
FOREIGN KEY (Admin_id) REFERENCES ADMIN(Admin_id),
FOREIGN KEY (Theatre_location) REFERENCES THEATRE(Location)
);
