Imports System.Windows.Forms

Public Class obrigado
    Dim tchau As New SndChanB("obrigado.wav")
    Private Sub Timer1_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Timer1.Tick
        Application.Exit()
    End Sub

    Private Sub obrigado_Activated(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Activated

        tchau.Open()
        tchau.PlaySnd()
    End Sub
End Class
