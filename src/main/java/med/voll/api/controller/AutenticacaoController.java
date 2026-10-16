package med.voll.api.controller;

import jakarta.validation.Valid;
import med.voll.api.domain.usuario.*;
import med.voll.api.infra.security.DadosTokenJWT;
import med.voll.api.infra.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@RestController
public class AutenticacaoController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        var usuario = (Usuario) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuario.getLogin(), usuario.getPerfil()));
    }

    @PostMapping("/cadastro")
    @Transactional
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroUsuario dados, UriComponentsBuilder uriBuilder) {
        if (usuarioRepository.findByLogin(dados.login()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Login já cadastrado no sistema"));
        }

        var senhaCriptografada = passwordEncoder.encode(dados.senha());
        var perfil = (dados.perfil() != null) ? dados.perfil() : PerfilUsuario.RECEPCIONISTA;
        var usuario = new Usuario(dados.login(), senhaCriptografada, perfil);
        usuarioRepository.save(usuario);

        var uri = uriBuilder.path("/usuarios/{id}").buildAndExpand(usuario.getId()).toUri();
        var tokenJWT = tokenService.gerarToken(usuario);

        return ResponseEntity.created(uri).body(new DadosTokenJWT(tokenJWT, usuario.getLogin(), usuario.getPerfil()));
    }

    @PostMapping("/recuperar-senha")
    @Transactional
    public ResponseEntity solicitarRecuperacao(@RequestBody @Valid DadosSolicitacaoRecuperacao dados) {
        var userDetails = usuarioRepository.findByLogin(dados.login());
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuário não encontrado com o login informado."));
        }

        var usuario = (Usuario) userDetails;
        var token = usuario.gerarTokenRecuperacao();
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(new DadosRespostaRecuperacao(
                "Código de recuperação gerado com sucesso. Válido por 30 minutos.",
                token
        ));
    }

    @PostMapping("/redefinir-senha")
    @Transactional
    public ResponseEntity redefinirSenha(@RequestBody @Valid DadosRedefinicaoSenha dados) {
        var optionalUsuario = usuarioRepository.findByTokenRecuperacao(dados.token());
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Token de recuperação inválido ou não encontrado."));
        }

        var usuario = optionalUsuario.get();
        if (!usuario.isTokenRecuperacaoValido(dados.token())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Token de recuperação expirado. Solicite uma nova recuperação."));
        }

        usuario.redefinirSenha(passwordEncoder.encode(dados.novaSenha()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso! Você já pode efetuar login."));
    }

}
