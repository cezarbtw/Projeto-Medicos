package med.voll.api.domain.paciente;

import med.voll.api.domain.endereco.DadosEndereco;

public record DadosAtualizacaoPaciente(
        Long id,
        String nome,
        String telefone,
        DadosEndereco endereco,
        String tipoSanguineo,
        String alergias) {

    public DadosAtualizacaoPaciente(Long id, String nome, String telefone, DadosEndereco endereco) {
        this(id, nome, telefone, endereco, null, null);
    }
}
