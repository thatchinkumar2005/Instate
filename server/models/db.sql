create database instate_v1;

create table users(
    username text primary key,
    email text not null unique,
    refreshtoken varchar(1024),
    pswd text not null,
    verified boolean default false,
    fname text not null,
    lname text,
    dob date,
    bio text,
    follows text [],
    followers text []
)


create table posts(
    id bigserial primary key,
    created timestamp not null default now(),
    caption text,
    images text [],
    liked text [],
    username text references users(username)
)

alter table posts 
add profilepicture text;




select * from (select * from posts order by 
    case 
        when username = any(array['nithin', 'thatchin']) then 0 
        else 1
    end,
    coalesce(array_length(liked, 1), 0) desc) as feed
limit 3; --query for the feed...

