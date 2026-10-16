alter table usuarios add perfil varchar(30) not null default 'RECEPCIONISTA';
alter table usuarios add token_recuperacao varchar(255);
alter table usuarios add expiracao_token_recuperacao datetime;

update usuarios set perfil = 'ADMIN' where login like 'admin%';

