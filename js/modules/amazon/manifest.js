console.log("modules/amazon/manifest.js");
import {allModules} from '../../modules.js';
var amazon = (function() {
    'use strict';
    
    return {
        name: "Amazon",        
        description: "This module looks through all activities of a user on amazon and captures those activities that the user has permitted",
        path: "/amazon",
        functions: ["browsing", "content"],
		viewGroups: [
			{
				name: "UX",
				title: "Select behaviour to be captured"
			}
		],
        is_enabled: false,
        URL: ["https://www.amazon.com/", "https://www.amazon.de/", "https://www.amazon.nl/"],
        privacy_level: 2,
        style: 'simple',
        status: "enabled",
        icons: ["data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1Ny4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjI5MTZEQjc3LUEyMDktNEFBQi1BN0NFLTZDMjk2NTUyOERCNkAxLjAweDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZyBpZD0iU3dhc2gtVmlld3MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNb2R1bGUtU3RhdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzcuMDAwMDAwLCAtMjA2Mi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9ImFtYXpvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTc3LjAwMDAwMCwgMjA2Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS0zIiBmaWxsPSIjMzIzMjMyIiBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTUuMjc0NTQ1NDUsMTYuMjczNjM2NCBDNS4zMTU0NTA0NSwxNi4yMDgxODU5IDUuMzgwOTAwOTEsMTYuMjA0MDg2OCA1LjQ3MDkwOTA5LDE2LjI2MTM2MzYgQzcuNTE2MzU1NDUsMTcuNDQ3NzMxNCA5Ljc0MTgxODE4LDE4LjA0MDkwOTEgMTIuMTQ3MjcyNywxOC4wNDA5MDkxIEMxMy43NTA5MDA5LDE4LjA0MDkwOTEgMTUuMzM0MDgyNywxNy43NDIyNzY4IDE2Ljg5NjgxODIsMTcuMTQ1IEMxNi45Mzc3MjMyLDE3LjEyODY0MDUgMTYuOTk3MDM3MywxNy4xMDQwOTUgMTcuMDc0NzcyNywxNy4wNzEzNjM2IEMxNy4xNTI0OTU5LDE3LjAzODYzMjMgMTcuMjA3NzIzMiwxNy4wMTQwODY4IDE3LjI0MDQ1NDUsMTYuOTk3NzI3MyBDMTcuMzYzMTgxOCwxNi45NDg2MzY0IDE3LjQ1OTMxNDEsMTYuOTczMTgxOCAxNy41Mjg4NjM2LDE3LjA3MTM2MzYgQzE3LjU5ODQwMDksMTcuMTY5NTQ1NSAxNy41NzU5MDUsMTcuMjU5NTQxNCAxNy40NjEzNjM2LDE3LjM0MTM2MzYgQzE3LjMxNDA5MDksMTcuNDQ3NzMxNCAxNy4xMjU5MDA5LDE3LjU3MDQ1ODYgMTYuODk2ODE4MiwxNy43MDk1NDU1IEMxNi4xOTMxNzM2LDE4LjEyNjgxODIgMTUuNDA3NzE5MSwxOC40NDk5OTU5IDE0LjU0MDQ1NDUsMTguNjc5MDkwOSBDMTMuNjczMTc3NywxOC45MDgxODU5IDEyLjgyNjM1OTUsMTkuMDIyNzI3MyAxMiwxOS4wMjI3MjczIEMxMC43MjM2MzY0LDE5LjAyMjcyNzMgOS41MTY4MSwxOC43OTk3Njg2IDguMzc5NTQ1NDUsMTguMzUzODYzNiBDNy4yNDIyNjg2NCwxNy45MDc5NTg2IDYuMjIzNjMyMjcsMTcuMjggNS4zMjM2MzYzNiwxNi40NyBDNS4yNzQ1NDU0NSwxNi40MjkwOTUgNS4yNSwxNi4zODgxNzc3IDUuMjUsMTYuMzQ3MjcyNyBDNS4yNSwxNi4zMjI3MjczIDUuMjU4MTczNjQsMTYuMjk4MTgxOCA1LjI3NDU0NTQ1LDE2LjI3MzYzNjQgWiBNOC45Njg2MzYzNiwxMi43NzU5MDkxIEM4Ljk2ODYzNjM2LDEyLjIxMTM2MzYgOS4xMDc3MjMxOCwxMS43Mjg2NDA1IDkuMzg1OTA5MDksMTEuMzI3NzI3MyBDOS42NjQwODI3MywxMC45MjY4MTQxIDEwLjA0NDUzNzMsMTAuNjI0MDk1IDEwLjUyNzI3MjcsMTAuNDE5NTQ1NSBDMTAuOTY5MDkwOSwxMC4yMzEzNjc3IDExLjUxMzE3NzcsMTAuMDk2MzY3NyAxMi4xNTk1NDU1LDEwLjAxNDU0NTUgQzEyLjM4MDQ1NDUsOS45OSAxMi43NDA0NTA1LDkuOTU3MjY4NjQgMTMuMjM5NTQ1NSw5LjkxNjM2MzY0IEwxMy4yMzk1NDU1LDkuNzA3NzI3MjcgQzEzLjIzOTU0NTUsOS4xODQwODY4MiAxMy4xODIyNjg2LDguODMyMjc2ODIgMTMuMDY3NzI3Myw4LjY1MjI3MjczIEMxMi44OTU5MDkxLDguNDA2ODE4MTggMTIuNjI1OTA5MSw4LjI4NDA5MDkxIDEyLjI1NzcyNzMsOC4yODQwOTA5MSBMMTIuMTU5NTQ1NSw4LjI4NDA5MDkxIEMxMS44ODk1NDU1LDguMzA4NjM2MzYgMTEuNjU2MzYzNiw4LjM5NDU0NTQ1IDExLjQ2LDguNTQxODE4MTggQzExLjI2MzYzNjQsOC42ODkwOTA5MSAxMS4xMzY4MSw4Ljg5MzY0MDQ1IDExLjA3OTU0NTUsOS4xNTU0NTQ1NSBDMTEuMDQ2ODE0MSw5LjMxOTA4NjgyIDEwLjk2NDk5MTgsOS40MTMxODE4MiAxMC44MzQwOTA5LDkuNDM3NzI3MjcgTDkuNDIyNzI3MjcsOS4yNjU5MDkwOSBDOS4yODM2MjgxOCw5LjIzMzE3NzczIDkuMjE0MDkwOTEsOS4xNTk1NDEzNiA5LjIxNDA5MDkxLDkuMDQ1IEM5LjIxNDA5MDkxLDkuMDIwNDU0NTUgOS4yMTgxNzc3Myw4Ljk5MTgyMjI3IDkuMjI2MzYzNjQsOC45NTkwOTA5MSBDOS4zNjU0NTA0NSw4LjIzMDkxMzE4IDkuNzA3MDM3MjcsNy42OTA5MTMxOCAxMC4yNTExMzY0LDcuMzM5MDkwOTEgQzEwLjc5NTIyMzIsNi45ODcyNjg2NCAxMS40MzEzNTU1LDYuNzkwOTA1IDEyLjE1OTU0NTUsNi43NSBMMTIuNDY2MzYzNiw2Ljc1IEMxMy4zOTkwOTA5LDYuNzUgMTQuMTI3MjY4Niw2Ljk5MTM2NzczIDE0LjY1MDkwOTEsNy40NzQwOTA5MSBDMTQuNzMzMDQyLDcuNTU2MjgxODggMTQuODA4OTM0MSw3LjY0NDQ4MDc4IDE0Ljg3Nzk1NDUsNy43Mzc5NTQ1NSBDMTQuOTQ3NDkxOCw3LjgzMjA0OTU1IDE1LjAwMjcxOTEsNy45MTU5MDkwOSAxNS4wNDM2MzY0LDcuOTg5NTQ1NDUgQzE1LjA4NDU0MTQsOC4wNjMxODE4MiAxNS4xMjEzNTk1LDguMTY5NTQ5NTUgMTUuMTU0MDkwOSw4LjMwODYzNjM2IEMxNS4xODY4MSw4LjQ0NzcyMzE4IDE1LjIxMTM1NTUsOC41NDM4Njc3MyAxNS4yMjc3MjczLDguNTk3MDQ1NDUgQzE1LjI0NDA4NjgsOC42NTAyMjMxOCAxNS4yNTYzNTk1LDguNzY0Nzc2ODIgMTUuMjY0NTQ1NSw4Ljk0MDY4MTgyIEMxNS4yNzI3MTkxLDkuMTE2NTg2ODIgMTUuMjc2ODE4Miw5LjIyMDkwNSAxNS4yNzY4MTgyLDkuMjUzNjM2MzYgTDE1LjI3NjgxODIsMTIuMjIzNjM2NCBDMTUuMjc2ODE4MiwxMi40MzYzNTk1IDE1LjMwNzUsMTIuNjMwNjg1OSAxNS4zNjg4NjM2LDEyLjgwNjU5MDkgQzE1LjQzMDIyNzMsMTIuOTgyNDk1OSAxNS40ODk1NDE0LDEzLjEwOTMyMjMgMTUuNTQ2ODE4MiwxMy4xODcwNDU1IEMxNS42MDQwODI3LDEzLjI2NDc2ODYgMTUuNjk4MTc3NywxMy4zODk1NDU1IDE1LjgyOTA5MDksMTMuNTYxMzYzNiBDMTUuODc4MTgxOCwxMy42MzUgMTUuOTAyNzI3MywxMy43MDA0NTA1IDE1LjkwMjcyNzMsMTMuNzU3NzI3MyBDMTUuOTAyNzI3MywxMy44MjMxNzc3IDE1Ljg2OTk5NTksMTMuODgwNDU0NSAxNS44MDQ1NDU1LDEzLjkyOTU0NTUgQzE1LjEyNTQ0NjQsMTQuNTE4NjM2NCAxNC43NTcyNjQ1LDE0LjgzNzcyNzMgMTQuNywxNC44ODY4MTgyIEMxNC42MDE4MTgyLDE0Ljk2MDQ1NDUgMTQuNDgzMTc3NywxNC45Njg2NDA1IDE0LjM0NDA5MDksMTQuOTExMzYzNiBDMTQuMjI5NTM3MywxNC44MTMxODE4IDE0LjEyOTMxODIsMTQuNzE5MDg2OCAxNC4wNDM0MDkxLDE0LjYyOTA5MDkgQzEzLjk1NzUsMTQuNTM5MDk1IDEzLjg5NjEzNjQsMTQuNDczNjMyMyAxMy44NTkzMTgyLDE0LjQzMjcyNzMgQzEzLjgyMjUsMTQuMzkxODIyMyAxMy43NjMxNzM2LDE0LjMxMjA0OTUgMTMuNjgxMzYzNiwxNC4xOTM0MDkxIEMxMy41OTk1NDE0LDE0LjA3NDc2ODYgMTMuNTQyMjY0NSwxMy45OTQ5OTU5IDEzLjUwOTU0NTUsMTMuOTU0MDkwOSBDMTMuMDUxMzU1NSwxNC40NTMxODU5IDEyLjYwMTM2MzYsMTQuNzY0MDkwOSAxMi4xNTk1NDU1LDE0Ljg4NjgxODIgQzExLjg4MTM1OTUsMTQuOTY4NjQwNSAxMS41Mzc3MjMyLDE1LjAwOTU0NTUgMTEuMTI4NjM2NCwxNS4wMDk1NDU1IEMxMC40OTg2MjgyLDE1LjAwOTU0NTUgOS45ODExMzYzNiwxNC44MTUyMzE0IDkuNTc2MTM2MzYsMTQuNDI2NTkwOSBDOS4xNzExMzYzNiwxNC4wMzc5NTA1IDguOTY4NjM2MzYsMTMuNDg3NzI3MyA4Ljk2ODYzNjM2LDEyLjc3NTkwOTEgWiBNMTEuMDc5NTQ1NSwxMi41MzA0NTQ1IEMxMS4wNzk1NDU1LDEyLjg0OTU0NTUgMTEuMTU5MzE4MiwxMy4xMDUyMjMyIDExLjMxODg2MzYsMTMuMjk3NSBDMTEuNDc4NDA5MSwxMy40ODk3NzY4IDExLjY5MzE4MTgsMTMuNTg1OTA5MSAxMS45NjMxODE4LDEzLjU4NTkwOTEgQzExLjk4NzcyNzMsMTMuNTg1OTA5MSAxMi4wMjI0OTU5LDEzLjU4MTgyMjMgMTIuMDY3NSwxMy41NzM2MzY0IEMxMi4xMTI0OTE4LDEzLjU2NTQ1MDUgMTIuMTQzMTczNiwxMy41NjEzNjM2IDEyLjE1OTU0NTUsMTMuNTYxMzYzNiBDMTIuNTAzMTgxOCwxMy40NzEzNjc3IDEyLjc2OTA4MjcsMTMuMjUwNDU4NiAxMi45NTcyNzI3LDEyLjg5ODYzNjQgQzEzLjA0NzI2ODYsMTIuNzQzMTc3NyAxMy4xMTQ3Njg2LDEyLjU3MzQwOTEgMTMuMTU5NzcyNywxMi4zODkzMTgyIEMxMy4yMDQ3NjQ1LDEyLjIwNTIyNzMgMTMuMjI5MzEsMTIuMDU1OTA1IDEzLjIzMzQwOTEsMTEuOTQxMzYzNiBDMTMuMjM3NDk1OSwxMS44MjY4MjIzIDEzLjIzOTU0NTUsMTEuNjM4NjMyMyAxMy4yMzk1NDU1LDExLjM3NjgxODIgTDEzLjIzOTU0NTUsMTEuMDcgQzEyLjc2NDk5NTksMTEuMDcgMTIuNDA1LDExLjEwMjczMTQgMTIuMTU5NTQ1NSwxMS4xNjgxODE4IEMxMS40Mzk1NDE0LDExLjM3MjczMTQgMTEuMDc5NTQ1NSwxMS44MjY4MjIzIDExLjA3OTU0NTUsMTIuNTMwNDU0NSBaIE0xNi4yMzQwOTA5LDE2LjQ4MjI3MjcgQzE2LjI1MDQ1MDUsMTYuNDQ5NTQxNCAxNi4yNzQ5OTU5LDE2LjQxNjgyMjMgMTYuMzA3NzI3MywxNi4zODQwOTA5IEMxNi41MTIyNjQ1LDE2LjI0NTAwNDEgMTYuNzA4NjI4MiwxNi4xNTA5MDkxIDE2Ljg5NjgxODIsMTYuMTAxODE4MiBDMTcuMjA3NzIzMiwxNi4wMTk5OTU5IDE3LjUxMDQ1NDUsMTUuOTc1MDA0MSAxNy44MDUsMTUuOTY2ODE4MiBDMTcuODg2ODEsMTUuOTU4NjMyMyAxNy45NjQ1NDU1LDE1Ljk2MjcyNjQgMTguMDM4MTgxOCwxNS45NzkwOTA5IEMxOC40MDYzNjM2LDE2LjAxMTgyMjMgMTguNjI3MjcyNywxNi4wNzMxODU5IDE4LjcwMDkwOTEsMTYuMTYzMTgxOCBDMTguNzMzNjI4MiwxNi4yMTIyNzI3IDE4Ljc1LDE2LjI4NTkwOTEgMTguNzUsMTYuMzg0MDkwOSBMMTguNzUsMTYuNDcgQzE4Ljc1LDE2Ljc1NjM1OTUgMTguNjcyMjY0NSwxNy4wOTM4NTk1IDE4LjUxNjgxODIsMTcuNDgyNSBDMTguMzYxMzU5NSwxNy44NzExNDA1IDE4LjE0NDUzNzMsMTguMTg0MDk1IDE3Ljg2NjM2MzYsMTguNDIxMzYzNiBDMTcuODI1NDQ2NCwxOC40NTQwOTUgMTcuNzg4NjI4MiwxOC40NzA0NTQ1IDE3Ljc1NTkwOTEsMTguNDcwNDU0NSBDMTcuNzM5NTM3MywxOC40NzA0NTQ1IDE3LjcyMzE3NzcsMTguNDY2MzY3NyAxNy43MDY4MTgyLDE4LjQ1ODE4MTggQzE3LjY1NzcyNzMsMTguNDMzNjM2NCAxNy42NDU0NTQ1LDE4LjM4ODYzMjMgMTcuNjcsMTguMzIzMTgxOCBDMTcuOTcyNzE5MSwxNy42MTEzNjM2IDE4LjEyNDA5MDksMTcuMTE2MzY3NyAxOC4xMjQwOTA5LDE2LjgzODE4MTggQzE4LjEyNDA5MDksMTYuNzQ4MTg1OSAxOC4xMDc3MTkxLDE2LjY4MjcyMzIgMTguMDc1LDE2LjY0MTgxODIgQzE3Ljk5MzE3NzcsMTYuNTQzNjM2NCAxNy43NjQwODI3LDE2LjQ5NDU0NTUgMTcuMzg3NzI3MywxNi40OTQ1NDU1IEMxNy4yNDg2MjgyLDE2LjQ5NDU0NTUgMTcuMDg0OTk1OSwxNi41MDI3MzE0IDE2Ljg5NjgxODIsMTYuNTE5MDkwOSBDMTYuNjkyMjY4NiwxNi41NDM2MzY0IDE2LjUwNDA5MDksMTYuNTY4MTgxOCAxNi4zMzIyNzI3LDE2LjU5MjcyNzMgQzE2LjI4MzE4MTgsMTYuNTkyNzI3MyAxNi4yNTA0NTA1LDE2LjU4NDU0MTQgMTYuMjM0MDkwOSwxNi41NjgxODE4IEMxNi4yMTc3MjM2LDE2LjU1MTgyMjMgMTYuMjEzNjMyMywxNi41MzU0NTA1IDE2LjIyMTgxODIsMTYuNTE5MDkwOSBDMTYuMjIxODE4MiwxNi41MTA5MDUgMTYuMjI1OTA1LDE2LjQ5ODYzMjMgMTYuMjM0MDkwOSwxNi40ODIyNzI3IFoiIGlkPSJTaGFwZSIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==","data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1Ny4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjM2MjlCQjE2LUI1MjctNDE2Ri04NDk0LTQwMkVFQjEyOEQ4MkAxLjAweDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZyBpZD0iU3dhc2gtVmlld3MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNYWluLVZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MjQuMDAwMDAwLCAtMTUwNC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwMC4wMDAwMDAsIDg0NC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJBbWF6b24iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA2MzYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImFtYXpvbi1kaXNhYmxlZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuMDAwMDAwLCAyNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTMiIGZpbGw9IiNDRENEQ0QiIGN4PSIxMiIgY3k9IjEyIiByPSIxMiI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik01LjI3NDU0NTQ1LDE2LjI3MzYzNjQgQzUuMzE1NDUwNDUsMTYuMjA4MTg1OSA1LjM4MDkwMDkxLDE2LjIwNDA4NjggNS40NzA5MDkwOSwxNi4yNjEzNjM2IEM3LjUxNjM1NTQ1LDE3LjQ0NzczMTQgOS43NDE4MTgxOCwxOC4wNDA5MDkxIDEyLjE0NzI3MjcsMTguMDQwOTA5MSBDMTMuNzUwOTAwOSwxOC4wNDA5MDkxIDE1LjMzNDA4MjcsMTcuNzQyMjc2OCAxNi44OTY4MTgyLDE3LjE0NSBDMTYuOTM3NzIzMiwxNy4xMjg2NDA1IDE2Ljk5NzAzNzMsMTcuMTA0MDk1IDE3LjA3NDc3MjcsMTcuMDcxMzYzNiBDMTcuMTUyNDk1OSwxNy4wMzg2MzIzIDE3LjIwNzcyMzIsMTcuMDE0MDg2OCAxNy4yNDA0NTQ1LDE2Ljk5NzcyNzMgQzE3LjM2MzE4MTgsMTYuOTQ4NjM2NCAxNy40NTkzMTQxLDE2Ljk3MzE4MTggMTcuNTI4ODYzNiwxNy4wNzEzNjM2IEMxNy41OTg0MDA5LDE3LjE2OTU0NTUgMTcuNTc1OTA1LDE3LjI1OTU0MTQgMTcuNDYxMzYzNiwxNy4zNDEzNjM2IEMxNy4zMTQwOTA5LDE3LjQ0NzczMTQgMTcuMTI1OTAwOSwxNy41NzA0NTg2IDE2Ljg5NjgxODIsMTcuNzA5NTQ1NSBDMTYuMTkzMTczNiwxOC4xMjY4MTgyIDE1LjQwNzcxOTEsMTguNDQ5OTk1OSAxNC41NDA0NTQ1LDE4LjY3OTA5MDkgQzEzLjY3MzE3NzcsMTguOTA4MTg1OSAxMi44MjYzNTk1LDE5LjAyMjcyNzMgMTIsMTkuMDIyNzI3MyBDMTAuNzIzNjM2NCwxOS4wMjI3MjczIDkuNTE2ODEsMTguNzk5NzY4NiA4LjM3OTU0NTQ1LDE4LjM1Mzg2MzYgQzcuMjQyMjY4NjQsMTcuOTA3OTU4NiA2LjIyMzYzMjI3LDE3LjI4IDUuMzIzNjM2MzYsMTYuNDcgQzUuMjc0NTQ1NDUsMTYuNDI5MDk1IDUuMjUsMTYuMzg4MTc3NyA1LjI1LDE2LjM0NzI3MjcgQzUuMjUsMTYuMzIyNzI3MyA1LjI1ODE3MzY0LDE2LjI5ODE4MTggNS4yNzQ1NDU0NSwxNi4yNzM2MzY0IFogTTguOTY4NjM2MzYsMTIuNzc1OTA5MSBDOC45Njg2MzYzNiwxMi4yMTEzNjM2IDkuMTA3NzIzMTgsMTEuNzI4NjQwNSA5LjM4NTkwOTA5LDExLjMyNzcyNzMgQzkuNjY0MDgyNzMsMTAuOTI2ODE0MSAxMC4wNDQ1MzczLDEwLjYyNDA5NSAxMC41MjcyNzI3LDEwLjQxOTU0NTUgQzEwLjk2OTA5MDksMTAuMjMxMzY3NyAxMS41MTMxNzc3LDEwLjA5NjM2NzcgMTIuMTU5NTQ1NSwxMC4wMTQ1NDU1IEMxMi4zODA0NTQ1LDkuOTkgMTIuNzQwNDUwNSw5Ljk1NzI2ODY0IDEzLjIzOTU0NTUsOS45MTYzNjM2NCBMMTMuMjM5NTQ1NSw5LjcwNzcyNzI3IEMxMy4yMzk1NDU1LDkuMTg0MDg2ODIgMTMuMTgyMjY4Niw4LjgzMjI3NjgyIDEzLjA2NzcyNzMsOC42NTIyNzI3MyBDMTIuODk1OTA5MSw4LjQwNjgxODE4IDEyLjYyNTkwOTEsOC4yODQwOTA5MSAxMi4yNTc3MjczLDguMjg0MDkwOTEgTDEyLjE1OTU0NTUsOC4yODQwOTA5MSBDMTEuODg5NTQ1NSw4LjMwODYzNjM2IDExLjY1NjM2MzYsOC4zOTQ1NDU0NSAxMS40Niw4LjU0MTgxODE4IEMxMS4yNjM2MzY0LDguNjg5MDkwOTEgMTEuMTM2ODEsOC44OTM2NDA0NSAxMS4wNzk1NDU1LDkuMTU1NDU0NTUgQzExLjA0NjgxNDEsOS4zMTkwODY4MiAxMC45NjQ5OTE4LDkuNDEzMTgxODIgMTAuODM0MDkwOSw5LjQzNzcyNzI3IEw5LjQyMjcyNzI3LDkuMjY1OTA5MDkgQzkuMjgzNjI4MTgsOS4yMzMxNzc3MyA5LjIxNDA5MDkxLDkuMTU5NTQxMzYgOS4yMTQwOTA5MSw5LjA0NSBDOS4yMTQwOTA5MSw5LjAyMDQ1NDU1IDkuMjE4MTc3NzMsOC45OTE4MjIyNyA5LjIyNjM2MzY0LDguOTU5MDkwOTEgQzkuMzY1NDUwNDUsOC4yMzA5MTMxOCA5LjcwNzAzNzI3LDcuNjkwOTEzMTggMTAuMjUxMTM2NCw3LjMzOTA5MDkxIEMxMC43OTUyMjMyLDYuOTg3MjY4NjQgMTEuNDMxMzU1NSw2Ljc5MDkwNSAxMi4xNTk1NDU1LDYuNzUgTDEyLjQ2NjM2MzYsNi43NSBDMTMuMzk5MDkwOSw2Ljc1IDE0LjEyNzI2ODYsNi45OTEzNjc3MyAxNC42NTA5MDkxLDcuNDc0MDkwOTEgQzE0LjczMzA0Miw3LjU1NjI4MTg4IDE0LjgwODkzNDEsNy42NDQ0ODA3OCAxNC44Nzc5NTQ1LDcuNzM3OTU0NTUgQzE0Ljk0NzQ5MTgsNy44MzIwNDk1NSAxNS4wMDI3MTkxLDcuOTE1OTA5MDkgMTUuMDQzNjM2NCw3Ljk4OTU0NTQ1IEMxNS4wODQ1NDE0LDguMDYzMTgxODIgMTUuMTIxMzU5NSw4LjE2OTU0OTU1IDE1LjE1NDA5MDksOC4zMDg2MzYzNiBDMTUuMTg2ODEsOC40NDc3MjMxOCAxNS4yMTEzNTU1LDguNTQzODY3NzMgMTUuMjI3NzI3Myw4LjU5NzA0NTQ1IEMxNS4yNDQwODY4LDguNjUwMjIzMTggMTUuMjU2MzU5NSw4Ljc2NDc3NjgyIDE1LjI2NDU0NTUsOC45NDA2ODE4MiBDMTUuMjcyNzE5MSw5LjExNjU4NjgyIDE1LjI3NjgxODIsOS4yMjA5MDUgMTUuMjc2ODE4Miw5LjI1MzYzNjM2IEwxNS4yNzY4MTgyLDEyLjIyMzYzNjQgQzE1LjI3NjgxODIsMTIuNDM2MzU5NSAxNS4zMDc1LDEyLjYzMDY4NTkgMTUuMzY4ODYzNiwxMi44MDY1OTA5IEMxNS40MzAyMjczLDEyLjk4MjQ5NTkgMTUuNDg5NTQxNCwxMy4xMDkzMjIzIDE1LjU0NjgxODIsMTMuMTg3MDQ1NSBDMTUuNjA0MDgyNywxMy4yNjQ3Njg2IDE1LjY5ODE3NzcsMTMuMzg5NTQ1NSAxNS44MjkwOTA5LDEzLjU2MTM2MzYgQzE1Ljg3ODE4MTgsMTMuNjM1IDE1LjkwMjcyNzMsMTMuNzAwNDUwNSAxNS45MDI3MjczLDEzLjc1NzcyNzMgQzE1LjkwMjcyNzMsMTMuODIzMTc3NyAxNS44Njk5OTU5LDEzLjg4MDQ1NDUgMTUuODA0NTQ1NSwxMy45Mjk1NDU1IEMxNS4xMjU0NDY0LDE0LjUxODYzNjQgMTQuNzU3MjY0NSwxNC44Mzc3MjczIDE0LjcsMTQuODg2ODE4MiBDMTQuNjAxODE4MiwxNC45NjA0NTQ1IDE0LjQ4MzE3NzcsMTQuOTY4NjQwNSAxNC4zNDQwOTA5LDE0LjkxMTM2MzYgQzE0LjIyOTUzNzMsMTQuODEzMTgxOCAxNC4xMjkzMTgyLDE0LjcxOTA4NjggMTQuMDQzNDA5MSwxNC42MjkwOTA5IEMxMy45NTc1LDE0LjUzOTA5NSAxMy44OTYxMzY0LDE0LjQ3MzYzMjMgMTMuODU5MzE4MiwxNC40MzI3MjczIEMxMy44MjI1LDE0LjM5MTgyMjMgMTMuNzYzMTczNiwxNC4zMTIwNDk1IDEzLjY4MTM2MzYsMTQuMTkzNDA5MSBDMTMuNTk5NTQxNCwxNC4wNzQ3Njg2IDEzLjU0MjI2NDUsMTMuOTk0OTk1OSAxMy41MDk1NDU1LDEzLjk1NDA5MDkgQzEzLjA1MTM1NTUsMTQuNDUzMTg1OSAxMi42MDEzNjM2LDE0Ljc2NDA5MDkgMTIuMTU5NTQ1NSwxNC44ODY4MTgyIEMxMS44ODEzNTk1LDE0Ljk2ODY0MDUgMTEuNTM3NzIzMiwxNS4wMDk1NDU1IDExLjEyODYzNjQsMTUuMDA5NTQ1NSBDMTAuNDk4NjI4MiwxNS4wMDk1NDU1IDkuOTgxMTM2MzYsMTQuODE1MjMxNCA5LjU3NjEzNjM2LDE0LjQyNjU5MDkgQzkuMTcxMTM2MzYsMTQuMDM3OTUwNSA4Ljk2ODYzNjM2LDEzLjQ4NzcyNzMgOC45Njg2MzYzNiwxMi43NzU5MDkxIFogTTExLjA3OTU0NTUsMTIuNTMwNDU0NSBDMTEuMDc5NTQ1NSwxMi44NDk1NDU1IDExLjE1OTMxODIsMTMuMTA1MjIzMiAxMS4zMTg4NjM2LDEzLjI5NzUgQzExLjQ3ODQwOTEsMTMuNDg5Nzc2OCAxMS42OTMxODE4LDEzLjU4NTkwOTEgMTEuOTYzMTgxOCwxMy41ODU5MDkxIEMxMS45ODc3MjczLDEzLjU4NTkwOTEgMTIuMDIyNDk1OSwxMy41ODE4MjIzIDEyLjA2NzUsMTMuNTczNjM2NCBDMTIuMTEyNDkxOCwxMy41NjU0NTA1IDEyLjE0MzE3MzYsMTMuNTYxMzYzNiAxMi4xNTk1NDU1LDEzLjU2MTM2MzYgQzEyLjUwMzE4MTgsMTMuNDcxMzY3NyAxMi43NjkwODI3LDEzLjI1MDQ1ODYgMTIuOTU3MjcyNywxMi44OTg2MzY0IEMxMy4wNDcyNjg2LDEyLjc0MzE3NzcgMTMuMTE0NzY4NiwxMi41NzM0MDkxIDEzLjE1OTc3MjcsMTIuMzg5MzE4MiBDMTMuMjA0NzY0NSwxMi4yMDUyMjczIDEzLjIyOTMxLDEyLjA1NTkwNSAxMy4yMzM0MDkxLDExLjk0MTM2MzYgQzEzLjIzNzQ5NTksMTEuODI2ODIyMyAxMy4yMzk1NDU1LDExLjYzODYzMjMgMTMuMjM5NTQ1NSwxMS4zNzY4MTgyIEwxMy4yMzk1NDU1LDExLjA3IEMxMi43NjQ5OTU5LDExLjA3IDEyLjQwNSwxMS4xMDI3MzE0IDEyLjE1OTU0NTUsMTEuMTY4MTgxOCBDMTEuNDM5NTQxNCwxMS4zNzI3MzE0IDExLjA3OTU0NTUsMTEuODI2ODIyMyAxMS4wNzk1NDU1LDEyLjUzMDQ1NDUgWiBNMTYuMjM0MDkwOSwxNi40ODIyNzI3IEMxNi4yNTA0NTA1LDE2LjQ0OTU0MTQgMTYuMjc0OTk1OSwxNi40MTY4MjIzIDE2LjMwNzcyNzMsMTYuMzg0MDkwOSBDMTYuNTEyMjY0NSwxNi4yNDUwMDQxIDE2LjcwODYyODIsMTYuMTUwOTA5MSAxNi44OTY4MTgyLDE2LjEwMTgxODIgQzE3LjIwNzcyMzIsMTYuMDE5OTk1OSAxNy41MTA0NTQ1LDE1Ljk3NTAwNDEgMTcuODA1LDE1Ljk2NjgxODIgQzE3Ljg4NjgxLDE1Ljk1ODYzMjMgMTcuOTY0NTQ1NSwxNS45NjI3MjY0IDE4LjAzODE4MTgsMTUuOTc5MDkwOSBDMTguNDA2MzYzNiwxNi4wMTE4MjIzIDE4LjYyNzI3MjcsMTYuMDczMTg1OSAxOC43MDA5MDkxLDE2LjE2MzE4MTggQzE4LjczMzYyODIsMTYuMjEyMjcyNyAxOC43NSwxNi4yODU5MDkxIDE4Ljc1LDE2LjM4NDA5MDkgTDE4Ljc1LDE2LjQ3IEMxOC43NSwxNi43NTYzNTk1IDE4LjY3MjI2NDUsMTcuMDkzODU5NSAxOC41MTY4MTgyLDE3LjQ4MjUgQzE4LjM2MTM1OTUsMTcuODcxMTQwNSAxOC4xNDQ1MzczLDE4LjE4NDA5NSAxNy44NjYzNjM2LDE4LjQyMTM2MzYgQzE3LjgyNTQ0NjQsMTguNDU0MDk1IDE3Ljc4ODYyODIsMTguNDcwNDU0NSAxNy43NTU5MDkxLDE4LjQ3MDQ1NDUgQzE3LjczOTUzNzMsMTguNDcwNDU0NSAxNy43MjMxNzc3LDE4LjQ2NjM2NzcgMTcuNzA2ODE4MiwxOC40NTgxODE4IEMxNy42NTc3MjczLDE4LjQzMzYzNjQgMTcuNjQ1NDU0NSwxOC4zODg2MzIzIDE3LjY3LDE4LjMyMzE4MTggQzE3Ljk3MjcxOTEsMTcuNjExMzYzNiAxOC4xMjQwOTA5LDE3LjExNjM2NzcgMTguMTI0MDkwOSwxNi44MzgxODE4IEMxOC4xMjQwOTA5LDE2Ljc0ODE4NTkgMTguMTA3NzE5MSwxNi42ODI3MjMyIDE4LjA3NSwxNi42NDE4MTgyIEMxNy45OTMxNzc3LDE2LjU0MzYzNjQgMTcuNzY0MDgyNywxNi40OTQ1NDU1IDE3LjM4NzcyNzMsMTYuNDk0NTQ1NSBDMTcuMjQ4NjI4MiwxNi40OTQ1NDU1IDE3LjA4NDk5NTksMTYuNTAyNzMxNCAxNi44OTY4MTgyLDE2LjUxOTA5MDkgQzE2LjY5MjI2ODYsMTYuNTQzNjM2NCAxNi41MDQwOTA5LDE2LjU2ODE4MTggMTYuMzMyMjcyNywxNi41OTI3MjczIEMxNi4yODMxODE4LDE2LjU5MjcyNzMgMTYuMjUwNDUwNSwxNi41ODQ1NDE0IDE2LjIzNDA5MDksMTYuNTY4MTgxOCBDMTYuMjE3NzIzNiwxNi41NTE4MjIzIDE2LjIxMzYzMjMsMTYuNTM1NDUwNSAxNi4yMjE4MTgyLDE2LjUxOTA5MDkgQzE2LjIyMTgxODIsMTYuNTEwOTA1IDE2LjIyNTkwNSwxNi40OTg2MzIzIDE2LjIzNDA5MDksMTYuNDgyMjcyNyBaIiBpZD0iU2hhcGUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+",""],
        version: 2,
        changelog: [],	
		type: "builtin",        
		is_verified: false
    };
}());
allModules.push(amazon);
export {amazon};