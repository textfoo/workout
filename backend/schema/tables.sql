create table if not exists exercises (
    id serial primary key,
    name varchar(128),
    muscle varchar(128), 
    equipment varchar(128)
);