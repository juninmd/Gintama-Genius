
':: Class that is used for in-game sound effects ::

Public Class SndChanB

    Private Declare Function mciSendString Lib "winmm.dll" Alias "mciSendStringA" _
    (ByVal lpstrCommand As String, ByVal lpstrReturnString As String, _
     ByVal uReturnLength As Integer, ByVal hwndCallback As Integer) As Integer

    Private strAudioLen As String = New String(CChar(" "), 128)

    ':: Properties for this class ::

    Private SndToPLay As String

    Public Sub New(ByVal Snd As String)
        '------------------------------------------------------------------------------------------------------------------
        ' Purpose: Constructor for creating an instance of this class 
        '------------------------------------------------------------------------------------------------------------------

        Me.SndToPLay = Snd

    End Sub

    Public Sub Open()
        '------------------------------------------------------------------------------------------------------------------
        ' Purpose: Open audio file
        '------------------------------------------------------------------------------------------------------------------

        Dim Path As String

        Path = CurDir() & "\" & Me.SndToPLay

        mciSendString("close myaudio", "", 0, 0)
        mciSendString("open """ & Path & """ alias myaudio", "", 0, 0)
        mciSendString("set myaudio time format ms", "", 0, 0)
        mciSendString("status myaudio length", strAudioLen, 128, 0)

    End Sub

    Public Sub Close()
        '------------------------------------------------------------------------------------------------------------------
        ' Purpose: Close audio file
        '------------------------------------------------------------------------------------------------------------------

        mciSendString("close myaudio", "", 0, 0)

    End Sub

    Public Sub PlaySnd()
        '------------------------------------------------------------------------------------------------------------------
        ' Purpose: Play audio file
        '------------------------------------------------------------------------------------------------------------------

        mciSendString("play myaudio", "", 0, 0)

    End Sub

    Public Sub StartFrom(ByVal Milliseconds As Integer)
        '------------------------------------------------------------------------------------------------------------------
        ' Purpose: Play audio file from (n) mS position 
        '------------------------------------------------------------------------------------------------------------------

        mciSendString("play myaudio from " & Milliseconds.ToString, "", 0, 0)

    End Sub
End Class


