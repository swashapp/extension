console.log("modules/surfing/manifest.js");
import {allModules} from '../../modules.js';
var surfing = (function() {
    'use strict';    
    return {
        name: "Surfing",
        description: "This module captures a user navigations for URL patterns that has been permitted by the user",
        path: "/surfing",
        URL: ["*://*/*"],
        functions: ["browsing", "content"],
		viewGroups: [
			{
				name: "UX",
				title: "Select behaviour to be captured"
			},
			{
				name: "PInfo",
				title: "Select Page Information to be captured"
			}			
		],
		filter_editable: true,
        is_enabled: false,
        privacy_level: 2,
        style: 'simple',
        status: "enabled",
        icons: ["data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1Ny4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPjExQTZCMzEwLTlBOTMtNDE3My04OTZELUNCNkI4QUFEODhDNUAxLjAweDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZyBpZD0iU3dhc2gtVmlld3MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgICAgICAgPGcgaWQ9IkRhdGEtdmlldyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQzMi4wMDAwMDAsIC00MzIuMDAwMDAwKSIgc3Ryb2tlPSIjMzIzMjMyIiBzdHJva2Utd2lkdGg9IjEuNSI+CiAgICAgICAgICAgIDxnIGlkPSJuZXR3b3JrLW5hdmlnYXRpb24iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzMi4wMDAwMDAsIDQzMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41ODgsMjMuMTQxIEMxMy4wNjE3OTgyLDIzLjIxMzc2MDYgMTIuNTMxMjA4NSwyMy4yNTAwMDE1IDEyLDIzLjI1MDAwMTUgQzcuMzAwMDI4NTIsMjMuMjUyNDQ1MiAzLjA5MzE5NTA5LDIwLjMzNDYzODQgMS40NDg3MDQ3NiwxNS45MzE3NTQyIEMtMC4xOTU3ODU1NzUsMTEuNTI4ODcgMS4wNjgyMjIwNiw2LjU2NzY4Nzc3IDQuNjE5MDAzMjYsMy40ODg0NTIzNSBDOC4xNjk3ODQ0NiwwLjQwOTIxNjkzMSAxMy4yNTk5MjIxLC0wLjEzOTkxMjAyNCAxNy4zODU3NDI1LDIuMTExMTY0MjIgQzIxLjUxMTU2MjgsNC4zNjIyNDA0NyAyMy44MDQ2MDY3LDguOTM5Njg0NTMgMjMuMTM3LDEzLjU5MiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjI4OSwyMi45MjEgQzcuNzY3LDIwLjY4OSA2Ljc0OSwxNi42MzMgNi43NDksMTIgQzYuNzQ5LDcuMzY3IDcuNzY3LDMuMzEyIDkuMjg5LDEuMDc5IiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTAuNzc0LDExLjI1IEwxMS4yNDksMTEuMjUiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTYuNDk5LDExLjI1IEwyMy4yNDksMTEuMjUiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMi45OTksNS4yNSBMMjEsNS4yNSIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLjA0NywxNy4yNSBMMTAuNDk5LDE3LjI1IiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjcxLDEuMDc5IEMxNi4wNTgsMy4wNTcgMTcuMDEsNi40NjUgMTcuMjEsMTAuNDM4IEMxNy4yMjQsMTAuNzEgMTcuMjM0MzMzMywxMC45ODEgMTcuMjQxLDExLjI1MSIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy4yNTYsMTMuOTkyIEwxNy4zNjQsMjIuOTY1IEMxNy40NjY5Njc1LDIzLjE1NjEzMzIgMTcuNjc0ODkzNSwyMy4yNjY0NjI0IDE3Ljg5MDg5MTksMjMuMjQ0NTc4MSBDMTguMTA2ODkwMywyMy4yMjI2OTM3IDE4LjI4ODQ2MTYsMjMuMDcyOTAxOCAxOC4zNTEsMjIuODY1IEwxOS41NTEsMTkuNTUgTDIyLjg2NiwxOC4zNSBDMjMuMDczOTAxOCwxOC4yODc0NjE2IDIzLjIyMzY5MzcsMTguMTA1ODkwMyAyMy4yNDU1NzgxLDE3Ljg4OTg5MTkgQzIzLjI2NzQ2MjQsMTcuNjczODkzNSAyMy4xNTcxMzMyLDE3LjQ2NTk2NzUgMjIuOTY2LDE3LjM2MyBMMTMuOTkzLDEzLjI1NSBDMTMuNzgyMTUxMSwxMy4xNjY1MTU4IDEzLjUzODcyNzUsMTMuMjE0MzQ5MiAxMy4zNzcwMzg0LDEzLjM3NjAzODQgQzEzLjIxNTM0OTIsMTMuNTM3NzI3NSAxMy4xNjc1MTU4LDEzLjc4MTE1MTEgMTMuMjU2LDEzLjk5MiBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=","data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1OSAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT44NzFCNjFGMC0zMTU2LTRCNzAtQjk2NS1FMkM0QTNBRjIxNkVAMS4wMHg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGcgaWQ9IlN3YXNoLVZpZXdzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgICAgIDxnIGlkPSJNb2R1bGUtU3RhdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NDguMDAwMDAwLCAtMjA3Mi4wMDAwMDApIiBzdHJva2U9IiNDRENEQ0QiIHN0cm9rZS13aWR0aD0iMS41Ij4KICAgICAgICAgICAgPGcgaWQ9IkJyb3dzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDQ4LjAwMDAwMCwgMjA3Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJuZXR3b3JrLW5hdmlnYXRpb24iPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41ODgsMjMuMTQxIEMxMy4wNjE3OTgyLDIzLjIxMzc2MDYgMTIuNTMxMjA4NSwyMy4yNTAwMDE1IDEyLDIzLjI1MDAwMTUgQzcuMzAwMDI4NTIsMjMuMjUyNDQ1MiAzLjA5MzE5NTA5LDIwLjMzNDYzODQgMS40NDg3MDQ3NiwxNS45MzE3NTQyIEMtMC4xOTU3ODU1NzUsMTEuNTI4ODcgMS4wNjgyMjIwNiw2LjU2NzY4Nzc3IDQuNjE5MDAzMjYsMy40ODg0NTIzNSBDOC4xNjk3ODQ0NiwwLjQwOTIxNjkzMSAxMy4yNTk5MjIxLC0wLjEzOTkxMjAyNCAxNy4zODU3NDI1LDIuMTExMTY0MjIgQzIxLjUxMTU2MjgsNC4zNjIyNDA0NyAyMy44MDQ2MDY3LDguOTM5Njg0NTMgMjMuMTM3LDEzLjU5MiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOS4yODksMjIuOTIxIEM3Ljc2NywyMC42ODkgNi43NDksMTYuNjMzIDYuNzQ5LDEyIEM2Ljc0OSw3LjM2NyA3Ljc2NywzLjMxMiA5LjI4OSwxLjA3OSIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT0iMC43NzQiIHkxPSIxMS4yNSIgeDI9IjExLjI0OSIgeTI9IjExLjI1IiBpZD0iUGF0aCI+PC9saW5lPgogICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPSIxNi40OTkiIHkxPSIxMS4yNSIgeDI9IjIzLjI0OSIgeTI9IjExLjI1IiBpZD0iUGF0aCI+PC9saW5lPgogICAgICAgICAgICAgICAgICAgIDxsaW5lIHgxPSIyLjk5OSIgeTE9IjUuMjUiIHgyPSIyMSIgeTI9IjUuMjUiIGlkPSJQYXRoIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjIuMDQ3IiB5MT0iMTcuMjUiIHgyPSIxMC40OTkiIHkyPSIxNy4yNSIgaWQ9IlBhdGgiPjwvbGluZT4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQuNzEsMS4wNzkgQzE2LjA1OCwzLjA1NyAxNy4wMSw2LjQ2NSAxNy4yMSwxMC40MzggQzE3LjIyNCwxMC43MSAxNy4yMzQzMzMzLDEwLjk4MSAxNy4yNDEsMTEuMjUxIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy4yNTYsMTMuOTkyIEwxNy4zNjQsMjIuOTY1IEMxNy40NjY5Njc1LDIzLjE1NjEzMzIgMTcuNjc0ODkzNSwyMy4yNjY0NjI0IDE3Ljg5MDg5MTksMjMuMjQ0NTc4MSBDMTguMTA2ODkwMywyMy4yMjI2OTM3IDE4LjI4ODQ2MTYsMjMuMDcyOTAxOCAxOC4zNTEsMjIuODY1IEwxOS41NTEsMTkuNTUgTDIyLjg2NiwxOC4zNSBDMjMuMDczOTAxOCwxOC4yODc0NjE2IDIzLjIyMzY5MzcsMTguMTA1ODkwMyAyMy4yNDU1NzgxLDE3Ljg4OTg5MTkgQzIzLjI2NzQ2MjQsMTcuNjczODkzNSAyMy4xNTcxMzMyLDE3LjQ2NTk2NzUgMjIuOTY2LDE3LjM2MyBMMTMuOTkzLDEzLjI1NSBDMTMuNzgyMTUxMSwxMy4xNjY1MTU4IDEzLjUzODcyNzUsMTMuMjE0MzQ5MiAxMy4zNzcwMzg0LDEzLjM3NjAzODQgQzEzLjIxNTM0OTIsMTMuNTM3NzI3NSAxMy4xNjc1MTU4LDEzLjc4MTE1MTEgMTMuMjU2LDEzLjk5MiBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",""],
        version: 3,
        changelog: [],		
		type: "builtin",
		is_verified: false		
    };
}());
allModules.push(surfing);
export {surfing};