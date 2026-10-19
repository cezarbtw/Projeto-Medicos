alter table pacientes add tipo_sanguineo varchar(10);
alter table pacientes add alergias varchar(255);

create table prontuarios (
    id bigint not null auto_increment,
    paciente_id bigint not null,
    medico_id bigint not null,
    consulta_id bigint,
    data_registro datetime not null,
    queixa_principal text,
    diagnostico text not null,
    prescricao text,
    observacoes text,
    peso decimal(5,2),
    altura int,
    pressao_arterial varchar(20),

    primary key(id),
    constraint fk_prontuarios_paciente_id foreign key(paciente_id) references pacientes(id),
    constraint fk_prontuarios_medico_id foreign key(medico_id) references medicos(id),
    constraint fk_prontuarios_consulta_id foreign key(consulta_id) references consultas(id)
);

