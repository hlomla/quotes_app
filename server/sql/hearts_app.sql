create table hearts_app(
    id serial not null primary key,
    username text not null,
	user_password text not null,
    love_count decimal(10)
)
