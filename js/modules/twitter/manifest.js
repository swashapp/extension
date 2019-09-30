console.log("modules/twitter/manifest.js");
import {AllModules} from '../../modules.js';
var Twitter = (function() {
    'use strict';
    
    return {
        name: "Twitter",
        description: "This module looks through all activities of a user on Twitter and captures those activities that the user has permitted",
        URL: ["https://www.authsaz.com/v3"],
        functions: ["browsing"],
		viewGroups: [
			{
				name: "UX",
				title: "User Experience"
			}
		],
        privacy_level: 3,
        is_enabled: false,
        status: "enabled",
        icons: ["data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1OCAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT42RDNCNEJEQi0zREZELTRGMTUtOTYxNS0yNDFFOEZBMUZCOTVAMS4wMHg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGcgaWQ9IlN3YXNoLVZpZXdzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTW9kdWxlLVN0YXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc3LjAwMDAwMCwgLTIxNTQuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJUd2l0dGVyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzcuMDAwMDAwLCAyMTU0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iIzMyMzIzMiIgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05Ljc2OTUwNzgsMTcuMjUgQzE0LjI5NzcxOTEsMTcuMjUgMTYuNzc1NTEwMiwxMy40OTc3ODU0IDE2Ljc3NTUxMDIsMTAuMjQ5Mzg0OCBDMTYuNzc1NTEwMiwxMC4xNDM4MjM4IDE2Ljc3NTUxMDIsMTAuMDM4MjYyOCAxNi43NzA3MDgzLDkuOTMyNzAxNzcgQzE3LjI1MDkwMDQsOS41ODcyMjkzMyAxNy42Njg2Njc1LDkuMTUwNTkwNTUgMTgsOC42NTYzNzMwMyBDMTcuNTU4MjIzMyw4Ljg1MzEwMDM5IDE3LjA4MjgzMzEsOC45ODI2NTI1NiAxNi41ODM0MzM0LDkuMDQ1MDI5NTMgQzE3LjA5MjQzNyw4Ljc0Mjc0MTE0IDE3LjQ4MTM5MjYsOC4yNTgxMjAwOCAxNy42Njg2Njc1LDcuNjgyMzMyNjggQzE3LjE5MzI3NzMsNy45NjU0MjgxNSAxNi42NjUwNjYsOC4xNjY5NTM3NCAxNi4xMDMyNDEzLDguMjc3MzEyOTkgQzE1LjY1MTg2MDcsNy43OTc0OTAxNiAxNS4wMTMyMDUzLDcuNSAxNC4zMDczMjI5LDcuNSBDMTIuOTQ4Mzc5NCw3LjUgMTEuODQzOTM3Niw4LjYwMzU5MjUyIDExLjg0MzkzNzYsOS45NjE0OTExNCBDMTEuODQzOTM3NiwxMC4xNTM0MjAzIDExLjg2Nzk0NzIsMTAuMzQwNTUxMiAxMS45MDYzNjI1LDEwLjUyMjg4MzkgQzkuODYwNzQ0MywxMC40MjIxMjExIDguMDQ1NjE4MjUsOS40Mzg0ODQyNSA2LjgzMDczMjI5LDcuOTUxMDMzNDYgQzYuNjE5NDQ3NzgsOC4zMTU2OTg4MiA2LjQ5OTM5OTc2LDguNzM3OTQyOTEgNi40OTkzOTk3Niw5LjE4ODk3NjM4IEM2LjQ5OTM5OTc2LDEwLjA0MzA2MSA2LjkzNjM3NDU1LDEwLjc5NjM4MjkgNy41OTQyMzc3LDExLjIzNzgxOTkgQzcuMTkwODc2MzUsMTEuMjIzNDI1MiA2LjgxMTUyNDYxLDExLjExMzA2NTkgNi40ODAxOTIwOCwxMC45MzA3MzMzIEw2LjQ4MDE5MjA4LDEwLjk2NDMyMDkgQzYuNDgwMTkyMDgsMTIuMTU0MjgxNSA3LjMzMDEzMjA1LDEzLjE1MjMxMyA4LjQ1Mzc4MTUxLDEzLjM3NzgyOTcgQzguMjQ3Mjk4OTIsMTMuNDM1NDA4NSA4LjAzMTIxMjQ4LDEzLjQ2NDE5NzggNy44MDU1MjIyMSwxMy40NjQxOTc4IEM3LjY0NzA1ODgyLDEzLjQ2NDE5NzggNy40OTMzOTczNiwxMy40NDk4MDMxIDcuMzQ0NTM3ODIsMTMuNDIxMDEzOCBDNy42NTY2NjI2NywxNC4zOTk4NTI0IDguNTY5MDI3NjEsMTUuMTA5OTkwMiA5LjY0NDY1Nzg2LDE1LjEyOTE4MzEgQzguNzk5NTE5ODEsMTUuNzkxMzM4NiA3LjczODI5NTMyLDE2LjE4NDc5MzMgNi41ODU4MzQzMywxNi4xODQ3OTMzIEM2LjM4ODk1NTU4LDE2LjE4NDc5MzMgNi4xOTIwNzY4MywxNi4xNzUxOTY5IDYsMTYuMTUxMjA1NyBDNy4wODUyMzQwOSwxNi44NDIxNTA2IDguMzgxNzUyNywxNy4yNSA5Ljc2OTUwNzgsMTcuMjUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=","data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1Ny4xICgxMDEwMTApIC0gaHR0cHM6Ly9za2V0Y2guY29tIC0tPgogICAgPHRpdGxlPkEwODYwMkZDLUZDNUMtNEFGQy1BNDIxLTE3NEY2OTE2NjcxOUAxLjAweDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggc2tldGNodG9vbC48L2Rlc2M+CiAgICA8ZyBpZD0iU3dhc2gtVmlld3MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJNYWluLVZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MjQuMDAwMDAwLCAtMTMyOC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwMC4wMDAwMDAsIDg0NC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJUd2l0dGVyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNDYwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJUd2l0dGVyLWRpc2FibGVkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjQ0RDRENEIiBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOS43Njk1MDc4LDE3LjI1IEMxNC4yOTc3MTkxLDE3LjI1IDE2Ljc3NTUxMDIsMTMuNDk3Nzg1NCAxNi43NzU1MTAyLDEwLjI0OTM4NDggQzE2Ljc3NTUxMDIsMTAuMTQzODIzOCAxNi43NzU1MTAyLDEwLjAzODI2MjggMTYuNzcwNzA4Myw5LjkzMjcwMTc3IEMxNy4yNTA5MDA0LDkuNTg3MjI5MzMgMTcuNjY4NjY3NSw5LjE1MDU5MDU1IDE4LDguNjU2MzczMDMgQzE3LjU1ODIyMzMsOC44NTMxMDAzOSAxNy4wODI4MzMxLDguOTgyNjUyNTYgMTYuNTgzNDMzNCw5LjA0NTAyOTUzIEMxNy4wOTI0MzcsOC43NDI3NDExNCAxNy40ODEzOTI2LDguMjU4MTIwMDggMTcuNjY4NjY3NSw3LjY4MjMzMjY4IEMxNy4xOTMyNzczLDcuOTY1NDI4MTUgMTYuNjY1MDY2LDguMTY2OTUzNzQgMTYuMTAzMjQxMyw4LjI3NzMxMjk5IEMxNS42NTE4NjA3LDcuNzk3NDkwMTYgMTUuMDEzMjA1Myw3LjUgMTQuMzA3MzIyOSw3LjUgQzEyLjk0ODM3OTQsNy41IDExLjg0MzkzNzYsOC42MDM1OTI1MiAxMS44NDM5Mzc2LDkuOTYxNDkxMTQgQzExLjg0MzkzNzYsMTAuMTUzNDIwMyAxMS44Njc5NDcyLDEwLjM0MDU1MTIgMTEuOTA2MzYyNSwxMC41MjI4ODM5IEM5Ljg2MDc0NDMsMTAuNDIyMTIxMSA4LjA0NTYxODI1LDkuNDM4NDg0MjUgNi44MzA3MzIyOSw3Ljk1MTAzMzQ2IEM2LjYxOTQ0Nzc4LDguMzE1Njk4ODIgNi40OTkzOTk3Niw4LjczNzk0MjkxIDYuNDk5Mzk5NzYsOS4xODg5NzYzOCBDNi40OTkzOTk3NiwxMC4wNDMwNjEgNi45MzYzNzQ1NSwxMC43OTYzODI5IDcuNTk0MjM3NywxMS4yMzc4MTk5IEM3LjE5MDg3NjM1LDExLjIyMzQyNTIgNi44MTE1MjQ2MSwxMS4xMTMwNjU5IDYuNDgwMTkyMDgsMTAuOTMwNzMzMyBMNi40ODAxOTIwOCwxMC45NjQzMjA5IEM2LjQ4MDE5MjA4LDEyLjE1NDI4MTUgNy4zMzAxMzIwNSwxMy4xNTIzMTMgOC40NTM3ODE1MSwxMy4zNzc4Mjk3IEM4LjI0NzI5ODkyLDEzLjQzNTQwODUgOC4wMzEyMTI0OCwxMy40NjQxOTc4IDcuODA1NTIyMjEsMTMuNDY0MTk3OCBDNy42NDcwNTg4MiwxMy40NjQxOTc4IDcuNDkzMzk3MzYsMTMuNDQ5ODAzMSA3LjM0NDUzNzgyLDEzLjQyMTAxMzggQzcuNjU2NjYyNjcsMTQuMzk5ODUyNCA4LjU2OTAyNzYxLDE1LjEwOTk5MDIgOS42NDQ2NTc4NiwxNS4xMjkxODMxIEM4Ljc5OTUxOTgxLDE1Ljc5MTMzODYgNy43MzgyOTUzMiwxNi4xODQ3OTMzIDYuNTg1ODM0MzMsMTYuMTg0NzkzMyBDNi4zODg5NTU1OCwxNi4xODQ3OTMzIDYuMTkyMDc2ODMsMTYuMTc1MTk2OSA2LDE2LjE1MTIwNTcgQzcuMDg1MjM0MDksMTYuODQyMTUwNiA4LjM4MTc1MjcsMTcuMjUgOS43Njk1MDc4LDE3LjI1IiBpZD0iVHdpdHRlciIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=",""],
        version: 1,
        changelog: [],
		style: {mainColor:"00acee", fontColor:"fff"},
		type: "builtin",
        streamId: "a9rsTWJvRe-0U2v1Lrwo-A",
        apiKey: "lgGPZYrAQW6GWLLufuzlkgrdRnnVopTUCdkeV3hYcu9w",
		is_verified: false		

    };
}());
AllModules.push(Twitter);
export {Twitter};