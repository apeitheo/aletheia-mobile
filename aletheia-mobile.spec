Summary: A media player with speed controls and voice feedback
Name: aletheia-mobile
Version: %%VERSION%%
Release: %%REVISION%%%{?dist}
License: GPL3
URL: https://github.com/apeitheo/aletheia-mobile
Requires: bc
Requires: calc
Requires: espeak-ng
Requires: ffmpeg
Requires: mpv
Requires: perl-Image-ExifTool
Requires: pulseaudio-utils
Requires: nodejs
Requires: socat
Requires: jq
Suggests: gtts
BuildArch: noarch

%description
A media player with pitch and tempo controls using music intervals with the ability to create seamless loops, save custom adjustments, and more.

%install

install -D -m 755 "%%TMPDIR%%/rpmbuild/SOURCES/usr/bin/aletheia-mobile" "%{buildroot}/%{_bindir}/aletheia-mobile"
install -D -m 644 "%%TMPDIR%%/rpmbuild/SOURCES/usr/share/aletheia-mobile/index.html" "%{buildroot}/%{_datadir}/aletheia-mobile/index.html"
install -D -m 644 "%%TMPDIR%%/rpmbuild/SOURCES/usr/share/aletheia-mobile/aletheia-webserver.js" "%{buildroot}/%{_datadir}/aletheia-mobile/aletheia-webserver.js"
install -D -m 644 "%%TMPDIR%%/rpmbuild/SOURCES/usr/share/aletheia-mobile/theme.css" "%{buildroot}/%{_datadir}/aletheia-mobile/theme.css"
install -D -m 644 "%%TMPDIR%%/rpmbuild/SOURCES/usr/share/aletheia-mobile/theme-dark.css" "%{buildroot}/%{_datadir}/aletheia-mobile/theme-dark.css"
install -D -m 644 "%%TMPDIR%%/rpmbuild/SOURCES/usr/share/aletheia-mobile/theme-light.css" "%{buildroot}/%{_datadir}/aletheia-mobile/theme-light.css"
install -D -m 644 "%%TMPDIR%%/rpmbuild/SOURCES/usr/share/aletheia-mobile/aletheia-mobile.svg" "%{buildroot}/%{_datadir}/aletheia-mobile/aletheia-mobile.svg"
install -D -m 644 "%%TMPDIR%%/rpmbuild/SOURCES/usr/share/doc/aletheia-mobile/LICENSE" "%{buildroot}/%{_docdir}/aletheia-mobile/LICENSE"
cp -p %%TMPDIR%%/rpmbuild/SOURCES/usr/share/aletheia-mobile/language.* "%{buildroot}/%{_datadir}/aletheia-mobile/"
chmod 644 %{buildroot}/%{_datadir}/aletheia-mobile/language.*

%files
%attr(0755, root, root) %{_bindir}/aletheia-mobile
%attr(0644, root, root) %{_datadir}/aletheia-mobile/index.html
%attr(0644, root, root) %{_datadir}/aletheia-mobile/aletheia-webserver.js
%attr(0644, root, root) %{_datadir}/aletheia-mobile/theme.css
%attr(0644, root, root) %{_datadir}/aletheia-mobile/theme-dark.css
%attr(0644, root, root) %{_datadir}/aletheia-mobile/theme-light.css
%attr(0644, root, root) %{_datadir}/aletheia-mobile/aletheia-mobile.svg
%attr(0644, root, root) %{_datadir}/aletheia-mobile/language.*
%doc %attr(0644, root, root) %{_docdir}/aletheia-mobile/LICENSE

%changelog
* Thu Apr 16 2026 Brad Hermanson 1.3
- Moved webserver.js to aletheia-webserver.js
* Tue Apr 14 2026 Brad Hermanson 1.2
- Added gtts as a weak dependency.
* Wed Apr 8 2026 Brad Hermanson 1.1
- Fixed missing language.* files.
* Mon Mar 16 2026 Brad Hermanson 1.0
- Initial release.
