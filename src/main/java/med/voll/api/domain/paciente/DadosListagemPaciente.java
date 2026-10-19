package med.voll.api.domain.paciente;

public record DadosListagemPaciente(Long id, String nome, String email, String cpf, String telefone, String tipoSanguineo) {

    public DadosListagemPaciente(Long id, String nome, String email, String cpf) {
        this(id, nome, email, cpf, null, null);
    }

    public DadosListagemPaciente(Paciente paciente) {
        this(paciente.getId(), paciente.getNome(), paciente.getEmail(), paciente.getCpf(), paciente.getTelefone(), paciente.getTipoSanguineo());
    }

}
