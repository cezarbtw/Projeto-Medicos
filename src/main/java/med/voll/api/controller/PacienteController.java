package med.voll.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import med.voll.api.domain.paciente.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("pacientes")
@SecurityRequirement(name = "bearer-key")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @PostMapping
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroPaciente dados, UriComponentsBuilder uriBuilder) {
        var paciente = service.cadastrar(dados);
        var uri = uriBuilder.path("/pacientes/{id}").buildAndExpand(paciente.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoPaciente(paciente));
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemPaciente>> listar(@PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        var page = service.listar(paginacao);
        return ResponseEntity.ok(page);
    }

    @PutMapping
    public ResponseEntity atualizar(@RequestBody DadosAtualizacaoPaciente dados) {
        if (dados.id() == null) {
            return ResponseEntity.badRequest().body("ID do paciente é obrigatório no corpo da requisição!");
        }
        var detalhamento = service.atualizar(dados);
        return ResponseEntity.ok(detalhamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity atualizarPorId(@PathVariable Long id, @RequestBody DadosAtualizacaoPaciente dados) {
        var detalhamento = service.atualizarPorId(id, dados);
        return ResponseEntity.ok(detalhamento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity detalhar(@PathVariable Long id) {
        var detalhamento = service.detalhar(id);
        return ResponseEntity.ok(detalhamento);
    }


}
