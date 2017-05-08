Public NotInheritable Class SplashScreen1

    Dim oie As New SndChanB("bemvindo.wav")
    'TODO: This form can easily be set as the splash screen for the application by going to the "Application" tab
    '  of the Project Designer ("Properties" under the "Project" menu).





    Private Sub bt_ok_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles bt_ok.Click

        If TextBox1.Text = "" Then
            MsgBox("Por favor insira seu nome")

        Else
            Principal.Lbl_nome.Text = TextBox1.Text
            Me.Hide()
            Principal.Show()
        End If


    End Sub

    Private Sub SplashScreen1_Shown(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Shown
        oie.Open()
        oie.PlaySnd()
    End Sub
End Class
