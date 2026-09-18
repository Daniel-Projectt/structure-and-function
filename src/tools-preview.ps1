Add-Type -AssemblyName System.Drawing
$D = 'C:\Users\DaniM\OneDrive\Desktop\Personal Projects\structure-and-function'

$cBg     = [System.Drawing.Color]::FromArgb(244,246,247)
$cInk    = [System.Drawing.Color]::FromArgb(16,22,27)
$cMuted  = [System.Drawing.Color]::FromArgb(109,122,133)
$cTeal   = [System.Drawing.Color]::FromArgb(15,107,99)
$cTealSo = [System.Drawing.Color]::FromArgb(226,241,239)
$cLine   = [System.Drawing.Color]::FromArgb(201,211,218)
$cAmber  = [System.Drawing.Color]::FromArgb(154,91,6)
$cAmbSo  = [System.Drawing.Color]::FromArgb(251,240,221)

function New-Canvas($w, $h) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
  $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  return @($bmp, $g)
}
function Draw-Mark($g, $cx, $cy, $r, $color, $bgColor) {
  # ring
  $pen = New-Object System.Drawing.Pen(([System.Drawing.Color]::FromArgb(90, $color)), ($r * 0.11))
  $g.DrawEllipse($pen, ($cx - $r), ($cy - $r), (2 * $r), (2 * $r))
  # two crossing s-curves (the double helix of the brand mark)
  $p1 = New-Object System.Drawing.Pen($color, ($r * 0.12)); $p1.StartCap = 'Round'; $p1.EndCap = 'Round'
  $p2 = New-Object System.Drawing.Pen(([System.Drawing.Color]::FromArgb(140, $color)), ($r * 0.12)); $p2.StartCap = 'Round'; $p2.EndCap = 'Round'
  $top = $cy - $r * 0.9; $bot = $cy + $r * 0.9; $k = $r * 0.55
  $g.DrawBezier($p1, $cx, $top, ($cx + $k), ($cy - $r * 0.5), ($cx - $k), ($cy + $r * 0.5), $cx, $bot)
  $g.DrawBezier($p2, $cx, $top, ($cx - $k), ($cy - $r * 0.5), ($cx + $k), ($cy + $r * 0.5), $cx, $bot)
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($color)), ($cx - $r * 0.17), ($cy - $r * 0.17), ($r * 0.34), ($r * 0.34))
}
function Draw-Chip($g, $x, $y, $text, $font, $fg, $bg) {
  $sz = $g.MeasureString($text, $font)
  $w = [int]($sz.Width + 26); $h = [int]($sz.Height + 12)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $rr = 9
  $path.AddArc($x, $y, $rr*2, $rr*2, 180, 90); $path.AddArc(($x + $w - $rr*2), $y, $rr*2, $rr*2, 270, 90)
  $path.AddArc(($x + $w - $rr*2), ($y + $h - $rr*2), $rr*2, $rr*2, 0, 90); $path.AddArc($x, ($y + $h - $rr*2), $rr*2, $rr*2, 90, 90)
  $path.CloseFigure()
  $g.FillPath((New-Object System.Drawing.SolidBrush($bg)), $path)
  $g.DrawString($text, $font, (New-Object System.Drawing.SolidBrush($fg)), ($x + 13), ($y + 6))
  return $w
}

# ---------------- preview 1200 x 630 ----------------
$c = New-Canvas 1200 630; $bmp = $c[0]; $g = $c[1]
$g.Clear($cBg)
$g.FillRectangle((New-Object System.Drawing.SolidBrush($cTeal)), 0, 0, 1200, 10)
Draw-Mark $g 150 300 78 $cTeal $cBg

$fTitle = New-Object System.Drawing.Font('Segoe UI', 54, [System.Drawing.FontStyle]::Bold)
$fEye   = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Bold)
$fSub   = New-Object System.Drawing.Font('Segoe UI', 20)
$fChip  = New-Object System.Drawing.Font('Segoe UI', 14, [System.Drawing.FontStyle]::Bold)
$g.DrawString('STUDY LAB', $fEye, (New-Object System.Drawing.SolidBrush($cTeal)), 268, 192)
$g.DrawString('Structure & Function', $fTitle, (New-Object System.Drawing.SolidBrush($cInk)), 258, 214)
$g.DrawLine((New-Object System.Drawing.Pen($cLine, 1.5)), 270, 318, 1120, 318)
$g.DrawString('Flashcards with spaced repetition. Practice exams built on', $fSub, (New-Object System.Drawing.SolidBrush($cMuted)), 268, 334)
$g.DrawString('application questions, with instant feedback. Matching. Labeled diagrams.', $fSub, (New-Object System.Drawing.SolidBrush($cMuted)), 268, 366)
$x = 270
$x += (Draw-Chip $g $x 440 '252 cards' $fChip $cTeal $cTealSo) + 12
$x += (Draw-Chip $g $x 440 '115 exam questions' $fChip $cTeal $cTealSo) + 12
$x += (Draw-Chip $g $x 440 '83 application' $fChip $cAmber $cAmbSo) + 12
$x += (Draw-Chip $g $x 440 '11 units' $fChip $cTeal $cTealSo) + 12
$g.DrawString('Anatomy & physiology', (New-Object System.Drawing.Font('Segoe UI', 13)), (New-Object System.Drawing.SolidBrush($cMuted)), 270, 560)
$g.Dispose(); $bmp.Save((Join-Path $D 'preview.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()

# ---------------- icon 512 x 512 ----------------
$c = New-Canvas 512 512; $bmp = $c[0]; $g = $c[1]
$g.Clear([System.Drawing.Color]::Transparent)
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc(0, 0, 200, 200, 180, 90); $path.AddArc(312, 0, 200, 200, 270, 90); $path.AddArc(312, 312, 200, 200, 0, 90); $path.AddArc(0, 312, 200, 200, 90, 90); $path.CloseFigure()
$g.FillPath((New-Object System.Drawing.SolidBrush($cTeal)), $path)
Draw-Mark $g 256 256 150 ([System.Drawing.Color]::White) $cTeal
$g.Dispose(); $bmp.Save((Join-Path $D 'icon.png'), [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()

"preview.png " + [math]::Round((Get-Item (Join-Path $D 'preview.png')).Length / 1KB) + " KB"
"icon.png " + [math]::Round((Get-Item (Join-Path $D 'icon.png')).Length / 1KB) + " KB"
