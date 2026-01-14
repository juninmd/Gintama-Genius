Public Class Principal
    Dim tempo As Integer ' Variavel do tempo no jogo
    Dim temporario As Integer = 21 ' Variavel temporaria para fazer o efeito de inicio

    Dim Vermelho As New SndChanB("vermelho.wav") 'som vermelho
    Dim Verde As New SndChanB("verde.wav")          'som verde
    Dim Azul As New SndChanB("azul.wav")                    'som azul
    Dim Amarelo As New SndChanB("amarelo.wav")          'som amarelo
    Dim GameOver As New SndChanB("fimdejogo.wav")       'som fim de jogo
    Dim Vapo As New SndChanB("uow.wav")                     'som uow
    Dim Novo As New SndChanB("novo.wav")                    'som novo jogo
    Dim Contador As Integer                                 'variavel do contador do uow


    Dim N As Integer = 0 'N é como se fosse a variavel temporaria das ordens das cores [1,2,3,4]
    Dim Pts As Integer = 0
    Dim Level As Integer = 0


    Dim tempo_variavel As Integer
    Dim dificuldade_variavel As Integer


    Private Sub TimerTempo_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TimerTempo.Tick

        tempo = tempo - 1
        Lbl_tempo.Text = tempo
        '
        If tempo = 0 Then
            Me.BackgroundImage = My.Resources.gameover
            GameOver.Open()
            GameOver.PlaySnd()
            Limpa_tela()
            MsgBox("Fim de Jogo, você fez " & Pts & " pontos!")
        End If
    End Sub

    Private Sub Btn_Iniciar_MouseDown(ByVal sender As System.Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles Btn_Iniciar.MouseDown
        Btn_Iniciar.BackgroundImage = My.Resources.iniciar2
    End Sub

    Private Sub Btn_Iniciar_MouseUp(ByVal sender As System.Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles Btn_Iniciar.MouseUp
        Btn_Iniciar.BackgroundImage = My.Resources.iniciar
    End Sub

    Private Sub Btn_Iniciar_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Btn_Iniciar.Click
        ' Ativa os botões para combinações
        PbVermelho.Enabled = True
        PbVerde.Enabled = True
        PbAzul.Enabled = True
        PbAmarelo.Enabled = True

        PbVermelho.Visible = True
        PbVerde.Visible = True
        PbAzul.Visible = True
        PbAmarelo.Visible = True

        Me.BackgroundImage = My.Resources.fundo1 'Reseta o fundo original

        'ativa o timer e o tempo regressivo do jogo
        TimerTempo.Enabled = True
        tempo = 60

        Select Case tempo_variavel
            Case "0"
                TimerTempo.Enabled = True
                tempo = 30
            Case "1"
                TimerTempo.Enabled = True
                tempo = 60
            Case "2"
                TimerTempo.Enabled = True
                tempo = 120
            Case "3"
                TimerTempo.Enabled = True
                tempo = 240
            Case "4"
                TimerTempo.Enabled = False
                tempo = 0
                Lbl_tempo.Text = "Infinito"
        End Select


        'Deixa as repostas off
        Respostas.Visible = False

        'Deixa o bonus da Kagura ativado
        Kagura.Enabled = True

        'Reseta as LBLS
        Lbl_1.Visible = False
        Lbl_2.Visible = False
        Lbl_3.Visible = False
        Lbl_4.Visible = False
        Lbl_5.Visible = False


        Select Case dificuldade_variavel
            Case "1"
                Respostas.Visible = False
                Kagura.Enabled = False
                Lbl_dificuldade.Text = "Berseck"

            Case "2"
                Kagura.Enabled = True
                Lbl_dificuldade.Text = "Normal"
            Case "3"
                Kagura.Enabled = True
                Respostas.Visible = True

                'Ativa as Lbls das respostas '
                Lbl_1.Visible = True
                Lbl_2.Visible = True
                Lbl_3.Visible = True
                Lbl_4.Visible = True
                Lbl_5.Visible = True

                Lbl_dificuldade.Text = "Facil"

        End Select



        'Resetas os uows
        Contador = 0

        'som de novo jogo
        Novo.Open()
        Novo.PlaySnd()

        'sorteia alguma cor
        Sortear()

        'reseta os pontos
        Pts = 0
        Lbl_Pontos.Text = Pts

        Level = 0
        Lbl_level.Text = Level

        'o item selecionado na listbox = N
        ' N = 0
        Respostas.SelectedIndex = N

        'deixa o botão invisivel
        Btn_Iniciar.Visible = False




    End Sub

    Private Sub ToolStripMenuItem2_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ToolStripMenuItem2.Click
        Sobre.ShowDialog()
    End Sub

    Private Sub ToolStripMenuItem3_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ToolStripMenuItem3.Click
        Regras.ShowDialog()
    End Sub

    Private Sub ToolStripMenuItem4_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ToolStripMenuItem4.Click
        Me.Visible = False
        obrigado.ShowDialog()
    End Sub

    Private Sub intro()
        ' Efeito de introdução
        If temporario = -1 Then
            Btn_Iniciar.Visible = True
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho
            introdu.Enabled = False
        End If

        If temporario = 7 Then
            Vermelho.Open()
            Vermelho.PlaySnd()
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho_on 'vermelho
            temporario = -1
        End If

        If temporario = 6 Then
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho
            temporario = 7
        End If

        If temporario = 5 Then
            Verde.Open()
            Verde.PlaySnd()
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde_on 'verde
            PbVermelho.Image = My.Resources.vermelho
            temporario = 6
        End If

        If temporario = 4 Then
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho
            temporario = 5
        End If
        If temporario = 3 Then
            Amarelo.Open()
            Amarelo.PlaySnd()
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo_on 'amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho
            temporario = 4
        End If

        If temporario = 2 Then
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho
            temporario = 3

        End If
        If temporario = 1 Then
            Azul.Open()
            Azul.PlaySnd()
            PbAzul.Image = My.Resources.azul_on 'azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho
            temporario = 2
        End If

        If temporario = 0 Then
            PbAzul.Image = My.Resources.azul
            PbAmarelo.Image = My.Resources.amarelo
            PbVerde.Image = My.Resources.verde
            PbVermelho.Image = My.Resources.vermelho
            temporario = 1
        End If

    End Sub

    Private Sub introdu_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles introdu.Tick
        ' tempo para a introdução
        If temporario > 20 Then
            temporario = temporario + 1
        End If

        If temporario = 25 Then
            temporario = 0
        Else
            intro()
        End If

    End Sub

    Private Sub Principal_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        reseta_tudo()
        introdu.Enabled = True
    End Sub

    Private Sub TimerAcender_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TimerAcender.Tick


        'Reseta todas as cores ao padrão
        PbVermelho.Image = My.Resources.vermelho
        PbVerde.Image = My.Resources.verde
        PbAzul.Image = My.Resources.azul
        PbAmarelo.Image = My.Resources.amarelo

        'Desativa a função ao clicar
        PbVermelho.Enabled = False
        PbVerde.Enabled = False
        PbAzul.Enabled = False
        PbAmarelo.Enabled = False

        'Verifica na Listbox o numero selecionado
        Select Case respostas.Text
            Case "1"
                PbVermelho.Image = My.Resources.vermelho_on
                Vermelho.Open()
                Vermelho.PlaySnd()
                ApagaCores()
            Case "2"
                PbVerde.Image = My.Resources.verde_on
                Verde.Open()
                Verde.PlaySnd()
                ApagaCores()
            Case "3"
                PbAzul.Image = My.Resources.azul_on
                Azul.Open()
                Azul.PlaySnd()
                ApagaCores()
            Case "4"
                PbAmarelo.Image = My.Resources.amarelo_on
                Amarelo.Open()
                Amarelo.PlaySnd()
                ApagaCores()
        End Select

        'Reseta a listbox ao começo indicando que terminou a combinação
        If respostas.Items.Count - 1 = respostas.SelectedIndex Then
            TimerAcender.Enabled = False
            Respostas.SelectedIndex = 0
            TimerApagarCor.Enabled = True
            PbVermelho.Enabled = True
            PbVerde.Enabled = True
            PbAzul.Enabled = True
            PbAmarelo.Enabled = True
        Else
            'Continua seguindo para a próxima ordem da listbox
            Respostas.SelectedIndex = Respostas.SelectedIndex + 1 'Seleciona a proxima ordem, onde fica a variavel [N]
        End If
    End Sub

    Private Sub PbVermelho_MouseDown(ByVal sender As System.Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles PbVermelho.MouseDown

        PbVermelho.Image = My.Resources.vermelho_on
        Vermelho.Open()
        Vermelho.PlaySnd()
    End Sub

    Private Sub PbAzul_MouseDown(ByVal sender As System.Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles PbAzul.MouseDown
        PbAzul.Image = My.Resources.azul_on
        Azul.Open()
        Azul.PlaySnd()
    End Sub

    Private Sub PbVerde_MouseDown(ByVal sender As System.Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles PbVerde.MouseDown
        PbVerde.Image = My.Resources.verde_on
        Verde.Open()
        Verde.PlaySnd()
    End Sub

    Private Sub PbAmarelo_MouseDown(ByVal sender As System.Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles PbAmarelo.MouseDown
        PbAmarelo.Image = My.Resources.amarelo_on
        Amarelo.Open()
        Amarelo.PlaySnd()


    End Sub

    Private Sub PbAmarelo_MouseUp(ByVal sender As System.Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles PbAmarelo.MouseUp, PbAzul.MouseUp, PbVermelho.MouseUp, PbVerde.MouseUp
        PbVermelho.Image = My.Resources.vermelho
        PbVerde.Image = My.Resources.verde
        PbAzul.Image = My.Resources.azul
        PbAmarelo.Image = My.Resources.amarelo

        If Respostas.Text = sender.tag Then 'Se o que esta na Listbox é a mesma tag que esta na imagem então'
            If Respostas.Items.Count - 1 = N Then 'Vai fazer a contagem de items na listbox -1, se for = N (onde indica os numeros), se ele acertou tudo então vai resetar'
                N = 0 'Reseta a contagem da lista das respostas
                Pts = Pts + 1
                Lbl_Pontos.Text = Pts
                Level = Level + 1
                Lbl_level.Text = Level
                Contador = Contador + 1
                Lbl_Pontos.Text = Pts
                Sortear()
                Respostas.SelectedIndex = N 'volta para o começo as respostas

            Else
                N = N + 1 'Adiciona um novo valor passando pra listbox
                Pts = Pts + 1
                Lbl_Pontos.Text = Pts
                Contador = Contador + 1
                Respostas.SelectedIndex = N
            End If
        Else
            'Se errar então dá game over
            Limpa_tela()
            GameOver.Open()
            GameOver.PlaySnd()
            Me.BackgroundImage = My.Resources.gameover
            Btn_Iniciar.Visible = True
            MsgBox("Você errou e fez " & Pts & " pontos!")
        End If
    End Sub

    Private Sub Sortear()
        'sorteio aleatorio
        'Cint = transformar em numero inteiro
        'no caso vai escolher um numero (1,2,3,4) e vai add na listbox
        Randomize()
        respostas.Items.Add(CInt(Rnd() * 3 + 1))

        TimerAcender.Enabled = True
    End Sub

    Private Sub TimerApagarCor_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TimerApagarCor.Tick
        TimerApagarCor.Enabled = False
        PbVermelho.Image = My.Resources.vermelho
        PbVerde.Image = My.Resources.verde
        PbAzul.Image = My.Resources.azul
        PbAmarelo.Image = My.Resources.amarelo
        'apaga tudo graças a função (ApagaCores)
    End Sub

    Private Sub ApagaCores()
        TimerApagarCor.Enabled = True

    End Sub

    Private Sub NoobToolStripMenuItem_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles NoobToolStripMenuItem.Click
        If Btn_Iniciar.Visible = True Then
            dificuldade_variavel = 3
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If
    End Sub

    Private Sub NormalToolStripMenuItem_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles NormalToolStripMenuItem.Click
        If Btn_Iniciar.Visible = True Then
            dificuldade_variavel = 2
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If
    End Sub

    Private Sub BerseckerToolStripMenuItem_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles BerseckerToolStripMenuItem.Click
        If Btn_Iniciar.Visible = True Then
            dificuldade_variavel = 1
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If
    End Sub

    Private Sub InfinitoToolStripMenuItem_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles InfinitoToolStripMenuItem.Click
        If Btn_Iniciar.Visible = True Then
            tempo_variavel = 4
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If


    End Sub

    Private Sub ToolStripMenuItem8_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ToolStripMenuItem8.Click
        If Btn_Iniciar.Visible = True Then
            tempo_variavel = 3
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If

    End Sub

    Private Sub ToolStripMenuItem7_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ToolStripMenuItem7.Click
        If Btn_Iniciar.Visible = True Then
            tempo_variavel = 2
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If

    End Sub

    Private Sub ToolStripMenuItem6_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ToolStripMenuItem6.Click
        If Btn_Iniciar.Visible = True Then
            tempo_variavel = 1
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If

    End Sub

    Private Sub ToolStripMenuItem9_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ToolStripMenuItem9.Click
        If Btn_Iniciar.Visible = True Then
            tempo_variavel = 0
        Else
            MsgBox("Você somente pode trocar antes de iniciar o jogo")
        End If
    End Sub
    Public Sub reseta_tudo()
        'Reseta as LBLS
        Lbl_1.Visible = False
        Lbl_2.Visible = False
        Lbl_3.Visible = False
        Lbl_4.Visible = False
        Lbl_5.Visible = False
    End Sub
    Public Sub Limpa_tela()

        reseta_tudo()

        PbVermelho.Visible = False
        PbVerde.Visible = False
        PbAzul.Visible = False
        PbAmarelo.Visible = False


        Respostas.Items.Clear()
        Respostas.Visible = False
        N = 0
        Lbl_Pontos.Text = Pts
        Lbl_level.Text = Level


        PbVermelho.Enabled = False
        PbVerde.Enabled = False
        PbAzul.Enabled = False
        PbAmarelo.Enabled = False

        Btn_Iniciar.Visible = True
        TimerTempo.Enabled = False
        Lbl_tempo.Text = 0




    End Sub


    Private Sub Lbl_Pontos_TextChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Lbl_Pontos.TextChanged
        If Contador = 30 Then
            tempo = tempo + 30
            Pts = Pts + 10
            Vapo.Open()
            Vapo.PlaySnd()
            PictureBox3.Visible = True
            Kagura.Enabled = True
            Label4.Visible = True

            Contador = 0


        End If
    End Sub

    Private Sub Kagura_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Kagura.Tick
        PictureBox3.Visible = False
        Kagura.Enabled = False
        Label4.Visible = False
    End Sub

    Private Sub TrocarDeJogadorToolStripMenuItem_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TrocarDeJogadorToolStripMenuItem.Click

        Limpa_tela()
        Me.Hide()

        SplashScreen1.Show()

    End Sub
End Class