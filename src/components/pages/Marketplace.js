﻿import React, { Fragment } from "react";
import { Route, Switch ,withRouter} from 'react-router-dom';
import {
    MDBCol,
    MDBSwitch,
    MDBRow,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBBtn,
    MDBTooltip,
    MDBCardTitle,
    MDBContainer,
    MDBTable,
    MDBTableHead,
    MDBModal,
    MDBTableBody,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
	MDBIcon,
	MDBView
} from "mdbreact";
import NavBar from '../microcomponents/NavBar'

class Marketplace extends React.Component {
    state = {
        modules: [],
		rows: []
    };

    componentDidMount() {
    };

    componentDidUpdate() {
    }
	
	generateRows(modules){
		let id = 0;
		var result = [];
		for(module of modules){
			id++;
			let owner = "fa fa-times-circle mr-2 red-text";
			if(module.isOwner == 'yes'){
				owner = "fa fa-check-circle mr-2 green-text";
			}
			let tasks = [];
			for(let task of module.tasks){
				switch(task){
					case "survey":
						tasks.push(<i key="tasks" className="fa fa-poll mr-2 blue-text" aria-hidden="true"></i>);
						break;
					case "clientInfo":
						tasks.push(<i key="tasks" className="fa fa-broom mr-2 blue-text" aria-hidden="true"></i>);
						break;
					case "debug":
						tasks.push(<i key="tasks" className="fa fa-exclamation mr-2 blue-text" aria-hidden="true"></i>);
						break;
				}
			}
			let x = {						
				'id': <MDBInput label={id} type="checkbox" id={'cb'+id} />,
				'name': module.name,
				'domain': module.domain,
				'owner': [<i key="owner" className={owner} aria-hidden="true"></i>],
				'tasks': tasks,
				'pay': module.pay
			  }
			result.push(x);		
		}
		return result;
	}

	render(){
	   const data_icons = {
			columns: [
			  {
				'label': '#',
				'field': 'id',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="name" className="fa fa-user mr-2 teal-text" aria-hidden="true"></i>, 'Name'],
				'field': 'name',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="domain" className="fa fa-internet-explorer mr-2 teal-text" aria-hidden="true"></i>, 'Domain'],
				'field': 'domain',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="owner" className="fa fa-check-circle mr-2 teal-text" aria-hidden="true"></i>, 'Is domain owner?'],
				'field': 'owner',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="tasks" className="fa fa-tasks mr-2 teal-text" aria-hidden="true"></i>, 'Tasks'],
				'field': 'tasks',
				'sort': 'asc'
			  },
			  {
				'label': [<i key="pay" className="fa fa-dollar-sign mr-2 teal-text" aria-hidden="true"></i>, 'Total Pay'],
				'field': 'pay',
				'sort': 'asc'
			  }
			],
			rows: this.state.rows
		};
		const modules = [
			{
				name: 'Streamr',
				domain: '*.streamr.com',
				isOwner: 'yes',
				tasks: ['debug', 'clientInfo', 'survey'],
				pay: '10k DAT',
				module: {
					"name": "Streamr",
					"description": "This module look through all the user activities on Streamr and capture those activities that user have permitted",
					"path": "/Streamr",
					"URL": [
						"https://www.streamr.com"
					],
					"functions": [
						"content",
						"browsing",
						"survey"
					],
					"viewGroups": [						
						{
							"name": "Debug",
							"title": "Debug and Error Logs"
						},
						{
							"name": "Survey",
							"title": "Surveys"
						}
					],
					"is_enabled": true,
					"type": "marketplace",
					"is_verified": true,
					"privacy_level": 3,
					"icons": [
						"iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAABGdBTUEAALGPC/xhBQAAM8BJREFUeAHtnQeYHMXRsLv3TgiJJH/kHEWOwuRoMEGIHPQRJJEkkZNNjhLJNiaDCUaAEGCif3KGz4AxSSCRMaAjigxGYFC82/nf6t3V7e12z07PhtvbnX6eeWamu7q6p6eqQ3VVtVJJSFogaYGkBZIWaM4W0M352T33q4NRKqU+VCuoQK3FVyzOtSjXIrwvYp61uffl+W0gT9U3qad4ToKjBRIGcDRMPURD7K0Q+xrUZR1zpc1dCH/uiPVrB8PGeqwaHxG+6cBam+6L6/yDg+FqYTVDDaRHH6QmqW2o7nxlVLlVdagjyb9/GTgaOmvCAHXwe4MD1QDVrnahKjuo6Wpd7pUcmVeug0+s2yokDNBNvyYYSc8+TQ2h+BFqlpnPV6smqWohbgS8CQPU+C8G+6tNVFqNVFPVXhTdp8bFJ8UVtEDCAAUNUo3XIGBKs78azLz+dObkq1ejjARnvBZIGCBeu0XKlSX8PdQwdRbEnxB+pFarLVDCAFVo7yzh7wrhj4Lw16xCET4o0z7AzQabMECF/3hwgFobwr8Wwl+/wqjjopscN2Mz5EsYoEJ/ORiq5gLVaMSZx3JvqRDa8tBo5Est6orykDR27krKmxu7pUK+DsnOIBa3fwFk6RCwWiX9wJL7C0agF7hfq29Wr9Sq4J5YTsIAZfy1YJiaH5HmNaDYsww0cbJ+CHFP5JoAof+b+5fo/XwJoq/0WLbSkhC5BZIpUOSm6goI8W8E8d1B7JJdUyr+1g6B/4uyHkGv5yU1h5qo/6p+rHgpTYowGQFi/Hjm+zLPvwCi7BUje+ksWn1jCL5FPax6q8cSgi/dZHEhEgbwaLms+sINEOfuHtmignbQ0z/CVOY6VhQP6cGsKpJQ9RZIGCBiE6OwtioSnvsh/uUjZokK9glEfz3AN+hx6vOomRK4yrRAwgAR2hHZ/ob0xw9B/P8TATwaiFZt9PjnqB3VLZXq7YPDsRP4L2uSlOrL1GlSMnUq/SsSBijRRsEQtT2E+neIX6ysyg9afQSuc7DpulmPYkyJERiNliTnemRdD1xrUb8luctiPN92YCaMcC6jyjkximiaLAkDhPxqiH8/iOtGiKsSi12Rz5/KBGqML+EHB6nFIPidELnuAI4Nqc9CIdXumqTVPuwF3N41MnnLtUAiBs21RMEdSc/RENqlXOV3ElrdCvrfQYjfFBTjfIXoV2If938B2FnNxGAmZyQTOLPYEwK0UFXCAPbGUUiWk1DUAhD/oRD+ZUUJvhEao0atDmMa8mSUrNgAz4EN8G709IdC9FtGyVMSRqZHSXC2QMIABU3DBteeEL+oNZQXNDha1PE6ws4s4tUFsA77Hcvi4ZS9YHkFJ7l9WiBhgLzWouffCgK8hSu+GaFGDpNSw3FHcmceausj0qV+SJeOxzrsGADmtgIlkVVtgYQBss2bNUy/F+LvHbvFtXqdXn8vev0PwnBA+HMyzTmBhe3vgcuX3IRlS9Kq0AIJA9CoLDiXY8H5CMQ/TxltfAvEPwLiD1VGY4r1W3r9ayir0htqZVS9ebM2PQMER9HjT1F3Q5DRRYuF9KLVRWqcOkFrsDhCdp5/MT3/UAdIdaIDVhdJcLZA/LmuE2UPS/gBaU9gPK7FqbgQ/AmIN48PJf5hOLqaqt6lnNoSv3yRqE0nwdkCTT0CMB3Zlx75EGfrhCeImvJBEP/NLrDgTiZF96uzKeMUYMrfT3AV5I7/klIvcCcnKd3xU+qi1ZH4rEJFxtMriymjX9CQtFL7he2wstBdhEXubcBt6Yc8JrRmIheoz8g9GaL/jOstpFE3syaZEhNjU2RryhEgOA6HVN+pu2IRv5CFVkexueVULzCao7PUY0AuUSUqmkkdnqP+L0Lkr7B9Nl6PgfCT4N0CTckA6nvjp2c179aSDFqdBfFf5cprLMXa1YOkV05zNFOu9OT3U/4D7N8/pm9gvyEJZbdA002BmJqswdRkAi3nz/xaXcG052hXqxvj+DQbYJXSHM0U9CJEfy17xXfoSxKJjqvt48b7E0Hckuogn3FYJT574hH/E0juxRTSGtAc3RX5/l0kVqZNtboPwh/NaJNIcawtXpnIphoBskpuV8douslYA6yDgcl3trxMe35Dry8bafF3kTsRPwLhn8lIk7gz6WyTqj01DQMYqUyHkcX382pNcS6l1Rb0xC/Y8jHtWReZ0D8g/nJ2kWVt8SnXEZQj6wfvABPOz4K4P6NQf+oi6hXv6VvUE96ImixDZYbrntBoHeoPEIYf8ct3aTa6XMQ/BLuudJkqFBmRqqhen0E5v0RtShh6GdYyA6nfpuTZlHosZYSzeQiYlj3OyLUjI9esvOjkMa8FmmIEgFj6Qyzv8t0ted8e5fERetEdbICoNvRld/dF0uQMr3hB3J9o9hOi2gtk9hb2J4+obP86UqFancR0KtkMczRWc4wAHeoMvt+P+DW98RzqMEe7KeQx4hEuPvEr9SyGlvsgzvzCWUY2genN+hD8MUxv9iKqF8/RQ6C2BjhhAEeLNTwDQDwrMjXY1/H97mhZiF6vPrEBgPMQcMbX69FqLBKlEaVsgzkwbwkOzLuQssQ0Ml7QFd6PiFeLus3V8AxAb3kmre/b+7+Ku5LL0PAsChD/muCMby6ZUn9iynNyEeK8iKyG6gkQ/ymU1TcvKXmscAs0tDYoc385IXEfrzaTRWmrGmnz1YPNborUMRBlXHGnLKjDiX8Yp0VOMdKqcxLi9/pzsYAbewToUMdBRL5Mfru+0ewUFzdom9kFXq84IVLMOSyoL3RBGuZqw64g7d5sc+VN4uO3QMMyAJteouXp1/srlpnsvtqaMzgY3/8z1bm2tJJxGMgjiZGpmDVgkTYPBvG3w6xWiZM1UxJZkRbw7R0rUmhNkGgWjr6bUxr14XHqfWv9ZqjLwRdHdfpB1hJHWXESaeT5s9TzVSP+QP3HVXYSr7ynBz2nzQJcjPgE2fFV6mxbFoh0Q+J3tqWViPuQ5fdQl7UYo9QGjDkvQfyrl8ATP1mrp+JnbvycDTkCoJ6wGkS1kefvu5lpykfWPB3qPGt8eOQ0FtN7aIdBitmcU/j/L8cWObx82cW+A3HrxaXAmjm9MdcAac/eXyggZdfxp5cWX0FbeRMJfkAh/tds+VhP/A8izodIq6TNgDhxfA+c47mP53uepvw3pXxEt/PzDbIA34J7O3fZgf7a3Duf5Zilt/CEOsk1YgHfcKHhVCGMyvNQc17Wwh5/awISmnVt8OjTPEf8JrY0Z5xWL9PzbsRGV9EZvUh75mDB+ziEuIUzf/QEIfonua5ntHnYZSTDN4gin0zjSgfZAVfqDa7XzSW+juZXrzWqLULjjQAHGEeyPsQvU4VrbZRhnGXN8iZ+WUscbCN+U0abOUO4POIXIpXNuFZ1Hb38x7a65+KYaq1Mnx+N+CVTZqEv08fMFFLULr5T0xkJn6Gd5JyyR2E0GWkaIjQeA/iKEsWV4Tzqb9a/OStEF8iawUReyVriLVsyPfFhENgBtjSPuDvZhvt9ZBvgDuXXGdgqEuDJTqntqPt2iIIVzPARzPAo7w8y0j1eSqXDhrJe4hpvCjTUiBQzvVeUVmb6AMEOLwTNngf2ebZHLEx2vf+MqtpybKR9WwjAaLIgcibpOX9VmBbxXY5SOhAx7T8iwhswiFXm/U/75PGC1eormOEm6nY9o9EHXnnrALihpEBmsacQLfqF+6zgU1F285X7a3WxjfgN/nbsEeISvzaHXq/vS/zW76p0ZID7l7Q6iWnW+4xwz/IP9jeq4pUup0r4GooB6Im2hWijf5PGj2cfh5xcqyFebS5TqX6oMlgC83A5yuggS1LpKM30rJ/6DaPUN6WBux1iM5hhLHYSXzDyjA4Oiz3a1exDohNLzapURkEdzFH9wv9hLTW1MAsEuwgEu35hfOh7wC7yFeqnQhgjlWo35w34Tze1Ggfh7wfeGYV46/x9PtrvTLqEj2GEc+qZERqLAbRdlOkkFlnE2UIH53GJbMgntNj3EZhIid2AvwKdRuqCzYBPFaywmr3m7gvzwginZxnhXLP/0X11sZbcMAxgdOgDo/5s/VBrZG92Ym0hQCXZLzzLgRhvW7NoTn7xDRp9pLnVbkhXkLmUGeZU/waDCDO7MwgjnMbXtLFGOMSMit1Zm7yyG4YBmHyIPo2PWPdLm8WXcZuojRlhXjOVeEyhcmAJWQnMWpYkd1TGHmEffbX6wQ0UPYUp3nesiq6JnqOKkOKUIE1dkNSxYPZrlypVq3EYQM7L9QsTrODf4io9I/e2JlsipXe1S5KCWJ6nr3baI1gKjxS1I9qoGMcD+xr36ZHyVBdINuZepYO42BzuXd2yQrH79JihiLo9MVBre9VBq1et8Cnm60UKDFbITCR6N4gnPy+EYCE9J6JBWUtED+IlooU5c4VD1rpNDOPlUtStH4ywGN+5KMwu15JESwcizN+fu9/6hwwxQgtlHcfIvRfTItnfeDIGjrKzNDMD2EeAwHPBKuoBtpDGZ4/vwXfiCtGhPWorIm5ctowp5H+nEIcxzknTmaRRKUkbfaVtgJm7EK6C70vACI8xJToPhfPRNlPUCpZVhKpxpkAK7w8+YQ7HCOAr/kwb30DFJQeY1fsE0e9pdR+24YOqHFhRqINB/kmPfBkKgrvj+ks8zgkTXMa4MKkc3M68mb2bM/B9/SSbaIs64aqQUIuhrgrV7ooSDcsUv0YkJtG8P0BsyNeLejXmpHPRG4nb8ejt0lvNz2L6P11rxDRjiLEsk+lE1DAGghsRFbi74JiurEnZI2inIVz+nvZKVVymgeCmLZ4oBVqJ9MYYAT6hl4pK/NJqgdMZ1VKkRid+xJVW4h9uFNB8iF/sEa6TqtV7YGR4g+so3LUvRksN43quonUWAyEU7ehAZNFe9dAYDNDurfH4pbVlA+8TXd614pkV0W1hLjO9HkT1cu61WncZ4ejBl2LEnKPcMsQ+gFFUrOg2g3kHgO/+cnHOzp+ZEv2R+l5W7T2D1tmF9uyHhbyqrx0jQAppiI8ESNk9x4HDr/dX1SV+pD6LsB98HSPfjlyK6WJADytWYZ/xJmeKydz+Fe6vsKHX5tWWAMO8E7ntYjxldxivGoN8cVjhA9zQDFMLw7DDdCU2BS2FNAYDpBgBfDb8XVOgtBEHWprJEaUdDJARJToyWaLFgqyaoQOFuoAzDDqDTPMWJm5h7r82TJFNo9eV9YyIiEXt+gF6eKttQxa8yw3mkXw7MsqIL9OLuDbtAhDnJcC7R5taEOnUri6Ltzhoc3kaYwrka1ieKpbbmwZJFS+Mcw1lvQdOayw/nX+NZ4gqBewQloQQ84k/vKQAO+UAqU+gzud6E4b40ExFsI2OOh0x07lxanOmRrKo/yG8wAipYpM9Sz2DhGiBCNBeII3CADKURw9u0aVdn8eFuY/90AzAxfAlapiGhVdlF5L5Jber5fJfvZ8DtSyMcDTXU0xH2mCGU3DaKyNHaBDDehhhDNOqlbluDQWOkiiHmU9Tj5h9iijwEWEagwH6mV3EDyN9M2dvIWJ73grbx/woqycHC/xl6NnYF9OtRmYelSlH21SyLeV1f1SGGc5HOfszGOFOrg1KVYop1DdcQ4CTwzy+KQUfmi5nIsxS9xnFx1DA6IlFIj9jCjhdrcTwVcwcafUFXP1pFPTGBDBAobcwdKAgoNS7NIp4HygZ4HjZshfxZNeQ5jfMp97J6cpnXYmfSE8lEoliKYc2c9vHqNEVLKikDtbAT52LH3UCeDbjmqcISNyJaHUPRoA3hrkPYR4sotmTqbvYFfQpwiOLT6VuhRn/bkmrWBTfU12TSIV7l164knf5U837ErPJNdWcr7x5XrT/o1b3omSyZyV2jWczQPbw6Cv56QdSo9nxltqJZ4Dd9Vi7UpX58YEaCx73TmjmWKC/8hFHuj4i64tTFm8bW+qQidLGUOREmOlyJ0yTJ9SAAaSFxT3LPdxP51/YRcPZ/4BEp5VFrXi+PomoMDrL5nDcUngwugnvG0y1HBCRojt7+e/UKFAdRK5SlRqIxOVEJ/ZAXQ0eN/FLRpHzBupQjnyWRVJRMIutGcZZrJv4JZe4Kcc9SHAAvXUSurMFhAx3pwKvw3Dn8j/Ei4Q1yOgLk5zCnv1OUJrsuscLaTrqYTBSmaGTAfw8Ke9sKzc7N9vDlmaNCxz+Ng8wCzdRmY0WOozVVTTYZoPSNTxcOzDHN53GBPMNGGGrsKZGZPoQY8GWMEH8dUGgTmXGEd7ZhlWCtE4GCLxETHLwRHH4L0bQfkbpyxYjISZljvm0JjkiN3LEJ9EBlmq62O65yg3THzp4Cia4NnQ0kHVDYByPRRNgFFdaJtPjKMdOR8XwRTGdDJDxFVkEYI3AXYhVHLWD8YfjXGBacIkeenGY0+GkthgyF7MqjeDvujyXu4HvTDdE2HAcTJCu+WcGaiSjwQvsOq/gKhshwCRGgk1Ijyp9K0Qlne7dYYxWmCH/vZMBlEOklw/d9Xmxrq8sHgazOnCpGRQCy7swksV1hjEH1Op7WxZrnIw6KU+DeCuixoyECf5KW2/GvxFhwVNcH/BcK8uwtSnvVZjAOTVGoPIVJ6FtCVxcJhgAo11Bfu/QyQABlfAJYk1kD5Pt0Y7Yqc6NmlBpQhG2MGlREXDzRcjeB4xwDPffcq3IoR196XkXhREG0XmM5v4o15Qqtcy84L2b+fooF372Qn5k6bw9dWhzwZSIHw6T7VcCpii5kwF8RwAxpbOHqBtAmdyuA5+1+pcdvSM2QCaQhMgtYHZq6XlhiofZ2xnFfSB7JAvCFL8BiRi/fBQZWVTAtDqLqerViELz6W52bvydfs3LNlz2DcbZkI4HjUTQU12isyLas9AOy+ZUpl4fOKpnj3abID5nz+CIDdQqaCPKXDIJMVvAiCjHcq7ALepYGGI5mEE2rG7jEmOjygQRf09Sd7h2cyn3I8rdLtZoFLD5OFVd4lPRfAbwmwJphxE6KrU+FWBuKjulxSFl9GN8FtSKZd7IYkRJTNwWYG7+T5hhX4hRhBWjuH6Mi6sg355Mth5gJCjesQeQct+ELgZTbpyF+xA6wm0LynO+5jPA+04oe4KoHBSHOT1Ve7VazahNFGCiEabQALJg8wmDzQ6yT44EtmQL0Ct/AyOMRjFkWf7JH7kiqbGEIhaN0zb1N+d0KGMSOToUhysR30NMhfq6kvPjOxmgxRg1RN9WRufdJgo1CmLaoW6cX3LuWSQ4s5ybGXflwCLdxZ/PTOavSShqARETS8/IfS+uXyM27FcEVCJCpHMwwyloNvWHCcrXYQqQDLWFOO1aXp1LOY+VqFZxsijtTTUjVnFaQYzOf2cVLaNA//y40GfmiPTU/yyEoYHvYQjbtTDe+Y5yEw27W2F69iytycTblMkKwTvfkWyA7+HOiOZ+EoLnf4iuzhJdWkJ8+weodMt0s4W5fwSFtvz8SHV2If9fuBbPj/d+1uoP/K9TbfmyumUTKUOmYdGDnPrZolaEPj8Oy9Q5AmSgJoYBF6V1OGTvojvuF6RnKtrI0hlvC7f6oQI6UFcYrVbvjI2XwehVBcZ1Y1fil08V3/6KjieN9dYsI6v/mE7wIkaH9aK0BNKj++iaVqOXvjcKvBMmwMZgGJZflkAZ34N/X5Kiz04Ej6hldKgzLCi7RBUywIQuqaVftraCpDwNpAPma9pxqntrLE3P5RgC72R+2WqtXzNFDjMOg5eL+MlLA/c7NpVepkN6CaIc4lqo5vCJ/D47ep9AXHsu3vueVmNgPKuKDUzwHPRxrTdOROPgDJ3RlMcAgdraqFEX1IwKf0rUawXR4a8iHrMEhrA3iZbh2zdsi7jtSt9MDQi/UKxvEulcGkddbeptGKGkwhmL5AvpbrahrLiSorlhn7/bZgKm/n2wrfDfH2hlFDgr7Pu7MkAK5SS/oaYPvodl46Q4aO9RYF3n0NsbXRYVS6vxEBr0zOLKJTGRWyBAjyeNyHKIehhGWDEsH53V0zCBaHj6idQ7ka7K49Wdr51PZqc4hWmmf9gHGljFla0LA5j5lrjH8Ana0Tu0xOi12+12BqwFPqFR/+hTrdmwAUf1DFM3sCboNTsueYjTAgNhhDdhhAts0r8cQpjgNRbVm/K/PsrFed0DNZT/NdCWB/q8G7wP2NKccRnbk1Gu9C4MYIC049QUF4YAXRJLMA3huymm1B58/DoWdOL37YLYjSrGE9PUE/V4Qon1W+s3UjauTkDU/GrYaICufxtMsA3/K95IECDHP9zhoaOFTtJ/g2wPY1praddiBmj1ZoCl6BU2tuBmS88+nFlhM5HyaVYrHxhqOo16bEje8CQ5mX2mmc8OCQdMUiO0QH/+04vsK9iFICAwTBCg3BZnTRCgZvMTewCWAB38m2hfyWAL64uDLeggqcJwg9kQ81VGGlmIxrzPiVmjv4bhIHoX67qCRr0ffH+zlhUlMnOk580wrBznuWaULD0eJqiahuevWGA+yvz6UFcbsTB+nTWB7Ae1u2Cc8VodhYaAXdsgUGd74wzUcNuucxEDiJYgROa7iTSYBWy/wo9h4TKVuHGF8SXf0yGWRC1wspybW16Q4zxf4+c9Ti82uJSor7yiujl3X3MGwOQq1aIVarmaDuVSG3FJmfTYT3M7RZ69gszd2zkzwBJgrEnQgB9dyajSZkakLhiLGMCkuk5P7JK1y0sfCGpol5jcS4vRzpuZe41478/HWzcxaNDp9Cq70ADxFlmdFRBW34Ze7A6a83NGhKtgiKHMFVeK6gGtE1X9PtEJzaKtZNr3QxVreQxt6BRSGBFpHFE2Uyg61s2s9W4xU+UOa5o7smim0kUVIpfPqKpOQZ9H1EujBq3eYkNkDRs4PcRfiD/cluaMk61spTYGp1UqxfC4KhDPAzOfE0f8BJFlP08fdBOShzvio6mfnDD4/PzPnbg2gSHEd+dq1K6lojXEFSLtNcaG0+zMTzV+RpewpYfEPQsDbWFLh67uI35nW5ojrgP906XwMfpFLt06AhhnUwFeV3xCoFZ3qqH2VeeCapoPOn6QiC3vcklu0Ft5h/S9+JnCKJUOwlQi9rudRg7dSKl0wdXCB2F+T2cyFmIawX0t9t7nZSSVtZYQ7M8VKTdgFHUsjI0cv0UdEaOczfkH21jz+e8Oy2JY1iSzg5UBTGprjAMb0mZxMht57oGP/5LeVEYBvxCoZXB9Nc41JeFnPkEfti1M8B8/xB7QWp3GMFy0vvHAUJegsj6T+bkwBKywKP9nBBWVXff4QTqttDFQX9mGxAgxMI20pZWIO8aavrwx4/zUmuaKLBDbOxmAxhFx07MuPNb4QG3AUGvfNu+l/gChxvEBM4jVhYwg1iA/kdFiAxLfswKUG5n5qc6dxHLR10N+fZX62UxddmYPRnZb/SV3nZ8hxyZ1sHN8nEODt6/BL8KR6EGrgTY7Dz0KdtP2KVcI8q3y6+ZkAIMgFUMBKc3Oq8iRCoLR7IwvxxcHSPZegHLoxcS1xoaU+mRBsZV5DZg5NkEQrx4wwhV86kpct8T+ZFGf+NYu+TGzAeWp4CgSoZnOM5dv4L9HtxwTm5HvO/cvwhlgPowefNyTZFpsAObpu9kajyHwNvD5ilgzqNLqEuaC+9nwShwjwRSMusUDsbj+CFxwSXzpFmCNIBZgQyG7Y72IKx81DoaRqC2XHzX7eQ71Z55/mv0e7eFgmzoLDPs52cdHQ5GFypsGhTJA1vOyEJRvuJDK2k3StDoMZHEWXTKq3MRIcJCrMgyJ4nfyGEaDDfhxL7ngkvhoLQBxXQYT7Exb/jdajjwo6WlnqUvzYmY/ZmcDl8yOiPIgh6BMK5bjZ7M+GAVFHsyg3HMoAxigfnyE7ygQYpJGo34KvmNzFfC8tzDYXY+8/sSwfIwG49km2YhyDgTu6zDYJC28BRi1H0LQsDVt6TdvF7SIXflXO1hLmAM1GV8JnsuXrKaOPgHrMmYTK0iWkgzAKPATHyJDlm84DunJ2rZM9NLXU/KNtrRIcYH6Ew17uW1IzOU3fm8Q++GtdEXKujDWD8whE7Zr4mA6lIDpp89cO9deAbvEdxbvNxgfQBkzzRxklPtO1vWlHNLnY4cuJbVk1CxKMoCplcawxF+CI8YI17m2yNmWOQKcr0f5aitMwFm109TTTIkWt6ZnI4WBGXVO4IMXp7zjif4wDN6a1mpspa1JzRLJmuBeOsKTYnxvf/UAO/e20OqtLLkwY7pI/GzBb22ZOUil9AggJdFj/8LNudVtq42JE69vbYboikA058xS+h4kyK5rvCDuEAM10TnM5mGVRTLfcRE2TivACBtmR4W2PBD7I94Psh7L7OlNFAsTXMjn3u/9yYFdgsc/eRpck73wtbObbQv+ngQHCJpoI4BAtpg5m6y4/UKgzqOX3tSWifllG8Qoej3TbemR4gLc+QXqIZjgVpt/oUIc2anRSzIqwBAr0AJLcO1NHWSx/zj3j7iLjokw5rVItQ/inoRcC7QaYvbb1Vdqc6O6ksPR9e7LUFZa4h9O6Iq2xJscukcokteHZWPhID12nJ28LyhpHQjOuhEGg+zCLFv8zJSnm5JZrJ9CH3GDyLTDviUsTaZtSJSaet4f2j5D1el0OueEwRSl4YCXTmdUYbxRn+nw8v3zM93WfIX/h3/Wym7QT+DvU1iG872XWir6CAAWhkAhUl+OlfIX47rNthiSRBrmPhhkOI/lye9FeS/AFfgD6h1GhL1tCyYpr1QobNxS8E2X3g+hSOaU+eifnkZvyxaWNdMgH7H43IzRqxSi4p+1U6c3CuND39vV2l4MYJDNaRavceTCW2Frdp6rQowOY0k7mqs8JpACAiQ/AZtuw8xRPSNhhrkkOgmVaQEECzPANMYT26r09ssX5oFwZ0K4rxbGh76nHX6LtPc0aGlvBmBBOBniOjW0gq7EtDqJadSRrmRGmCuZBIm4bZYLxiseDVXqei3XFzDBlYhl14s7KniV2wzAvdUNfKbfNDPt0O0PPP3JKqel2NueTb+oNwOYAlZQV3F/0bOwHPjl9AT75F4K70ZdIoVCXSUcsHYinxcmOIJB8mU2+CfDDFez7hhodNQ7YZInjxYwHaFCG9MvbGYF156qDEotY8UTePikFQRaLeK1CM4vFCJaBaJ6mbi58+MjPUsPz64ePb6zAaW3hmDvBZ+sH6oVRG3vPeryElKEiRTyMfdPGIU+zbplrFa5DYGXTuQg2Zn3+Jg3+edrFsLzr8UC8P3CeOe7VhOZMg8oTIcmN+Bf+nTMj8QbASiZCrwL8YworESkd1ExRr7OSLC5Cx4Z8XhgRFT1lAumAvFiFim66/vzIy/lupcfMZEZ7vc05pdcF+erzlagvMZC4Tt10XgUt2gK0yifeTWMy1Gu7yEvjACxGUAqDBPcTo95pVflc8DiDzStHjMi0FxcwR383yDyEoOXs7lqK5YUDxIBHum+NYvzgpolr6YFljdWedElOKIgt3+xl2c6u+n83289WnUBa8e0nPFD5CNEibkGyK/pcur3VD6e5qU0CPJ/mEBEoNaAlCANI5xFGdsB8IkVqLqRg1krLFrdInomdvk31NxvA0qzcWkLgeco8EOxLTj1mQnq723orXGBmq+sEUCQmkJbjYz3O2shpSNF1ew6mCBUssRewZMwgbjivgiUftKH0nUIh5jJOJQEewtoD6tBGcVTxnFyMS5tLBCL420xop59o0PLV3tIlLT6oGwGkPphoP4ZHzaYR+HAeCGNysQQNdZpRwBWRoJfuI6nrPVghFfiFRQjVwclJsHeAn2QCEY3obwSWrFPdVIGT7RpruZUS1m92UP0RbngseOIF5tVlbiD3PFVGnCvQu69mBeKTbIzmMUUTq1ohlHZhawTtuwErbaE8Z4pG0+DIkCKszLCAzlrWCQzvYs+MzA2IHdio3FFCOEqhCJbM0Ycw/+Ukb5XAR4h+DauG/kXNxekdXlFeHEAEYdyydS1kMZl9iC0dSl4HitMJL68QOEH8wFjysOCxViLGmn2BEogMuoVD5gTRM6i3OVLgMdLrjIDGD2WNqNqfCAVXMpSyel826v8ypP5ac71llkYfo/AQE5YzPz8QlS/kPYCWjO/C+tgskdT/YnMgyhzgUIkvIsY+w3GxVOZmv7Dkt5joirOAPLlzOdPgJMvKLsVxGhmLvV7OZytFK6sMpRolh7Kz9ka+Mp9W7UZYChqxgHChFJB9k9a1dpZn0hF0HQ+t4Jn36KEwgiZsvRWK9vUvLMdytPg2bQwW9G7WIn1UmvgaOrDorQeElGVuS29wp/pHaQHKS+IW/Of1b+ZWu1XChGL8XZR1qOH3AbYFbn+DAtYtU9L4SpK12WsbYqQdY0wa54gotc82T9pt5uTMg0RsW1p4pfixXXJDMcezoPGa1xp4s/g6UvL7ND1i3rWW1UYQJoAJjgZAvxD2c0hxtC46KB3E0e2kaY4MMIkrhOBljngJllmfCdmXTrodd+Kmbd0thnYLvuo8AYFJz3mSggcBxbm0gvvgVq6MMq8Zy2lrGm2SM3pwT04VI0BpE3ojU+F+MTRUrTVfVhDiiPbtHoLRrgwiuGLKV/2EG5Rzwszcl+NdYVYgw0n7VruMqeOonR3PkO8v/Zr2Lfkp6XpcX2C7vRr2SWbi6C7AOW9aA63soXAW/WkMqOsrS41iGutdhkQ3xX03F8jub+ZsspzMCUbZ4q5crs6FEb4C6YPf8bRkv1HWj7MWKBlJAlGVGacAP8X3RRx5CQ9q2yxy11DBAF4U+p26n+LBVUlo1w2rvYyAvWBNcGXAVymiClGTZ/uSjvk8dZK1l9k1RlAPhnCu5OF8bc0rCi3zVt2MwRGv/9ElmCHwwhXsKC7Kqud6IU6q9c+nkxydU+Q0xj9wnsOcPuUxgEMc39mTfIdAVI9mwGqOgXKb2B6UhGXbc5VSYnB3PTUp6BJIgc8P8hIs7PL6iy/LvXyTH03oS6yToke+jrFoEValqFI3aoHfvVpqZCgIbSy1UusGQPIJzAPfx0VuAFMMf5e4U9qAd8gpln3YbD5KaPCuYw4xui5wuVUFl1ajfRCqFVb1rdml2zGriGj1dolPvRlLlS/7WFxe7QjtqNnjwCVk5U72scVTY99JGmi11PeusBVQCb+C24Pcz3ExOtJ8YIcDl67VMSW/VjLSP36RC6VfRFG0oMK4WH23zK9fKIwPuT9QzqjIomaEaW248o+evgRPP2ig9cfZE3WALbPpuGuZArwAr32naQvZ4OpQNxi4Bhurp/UTEaGVxh9JkAsExBtToT13qZHnVWBcvxRdJhTC6MTf6aE+6wFiX8kn+CywPIVpWqjDu1Tct3BdhsDSEuwOH6V4XsALrIuYC4/QqKq2EJzUIY40soQSzsldagZjERi2DOZty+5S48sd7ne1WMdEpcyKxkMVwuzbjnDC41oQM7ntKDbyQuXa9HvuwegyvDs51nhaoF3KwPIR9ED/8jtEIbxsRDnNVx+i7lyWiYwiltrU2bGh2nQFRkjxqvsvQ6u+Fb/dONhbb6upZV8uzcrteoCCDMtATOt2yWy1EvKIfXyHwFeK1VUvafXdBEc1hjMbV9gVrouPe/xXOKKsfuDEMQsRLh2M75Y9WOevSUZh3hnbjGOCIqzzTB+N31GzmmwvUuVvMjOtrjAvJhAJQyQ1xxlPxp9HvHf2WocH90NwoI+uewi/BEIEwwtXjD6I+JjhqHp2YG/Iv8wnumYy9h7Py90Wj3FqDu1MI+pm8vWthBY3mV3v0+ZZ4rZ8NY4rm5GgPzvRtvxMxbJ4klsHRr6/3HvXkbQ4R6o8+vuembXWVyzPMS1iAsmJN6qWAjRrgM+0SWKHrQ5WtQGv6Mt0hnHjrSNkZzwdZpQlwyQayuY4HX0ifZg11Lm6PUxIuQq53EPRiFv+kHdBbGu7pEtA6rV/9EO9n2TdEQt0s5C5bStBztf857SjsMN80C6PPqYHnbJWF8vdc0AuaZiffCGGRE0C2SNzns53qRzSGt0R8q1AHZMT1HctjGKbGc6eJQtn8GrI6o/dyJ4ianUV52vmSdw9aVNf1MYH/qeUo+EpveQxB7BALm2ZDSQ0+iH4IpL5PtH8dPEmVXdBuMSfBpG2lGMS+xfcbnL+AXR8cng7WvP5ohNIWmzhRlspGUUDW2pxXEy/w/U48UJPS+mRzFArnnFQowR4UqYYQBiShEB+hhm59BU7c6UJ8X+wmFIkF6AUJaNVZCmp/6VGm3Ly9x/ceKPsKU542QfYW5GT1voULvbokPi5HyF70PSe0xSj2SA/Nalh5wAMxyBRGIhRoQtmeP+ifvr+TBlP6dQWogYIM6NmPK8AvhVXPE1X1PqGOT+P1mLTatRXj22IAnUzTZVEKY/89FeInCIHnRjTH/kg7t9Iyx6q4dDIpGYBcQz2etkzqhdDHO97fi5A/n5IilZIhyDM7WdAf8DZyoJ0uOj47odcCO4diVKh8FHSDtfVMhtcIwsG4P9IL7JL2jHeVzTmFL6TqXinvXsV+OaQJf7o2pSyUoUYjwdzFJr8bPXAl/uWpX33qH4GVEY7k8uhGFDS4xz1kauP5D7geBZshAm5vudmA7tbXMfAqPNwejyGmWt4oVbowiYsZUuygZDvUHkGkUJrgiZmo1Ti9nq58pSz/ENMwKUauSst+d/ACeXCWaH9xBOlZnF9KkD/Rxl7I8XgsDkuYX7MxD/owKc9ZYgU4WtiBfP1SLSrGz7iYvJFrW/k7gmcTSR8iR+MhAkX1Ew07W0B/ELBplKuZ1SFZVR7xGV/YH1/rUF9cv+yO+IluudguTZr+gEzYWdgTDOerMjK//wCWPRLli2Tbehpg7CeKfa0kLjtHqA3v8lK0zgPqzECi+RqbJ9PjlRd0dCj18E16jRjqWc6hE/mqdMbray+emR78tKfUSFQgx/fEIA01i1TmEomUbt7YMM2GcZEd/3zFPX4AkDRPs9G0YDiwGlOSGxj9rIpXFqDPcDs4u8UAzstyIhc0nERsMcfv9fN1bvL+3p1wAx/kCDZPHbcIr60XK2wk5qEBIsUQkvCmbdMYUzGHz1fQSTVv/hsnqbY0QRTxh7FhUYFiHe5BaIdURuGNZuT0sYoHt+QTtdzxFMJ45ynWdsFugP0OMGRqzqX0uN/0/HuczgPBuEfhJArW7Rl7D/3GChqRfB3fIvtVlMHw3xO73NmX2F/RkdAnVArDqK2HOcusmWl7n/FuDdxZbmjBMHYiljv+0E6akJCQPU7s99AhEdD2HeHVakkfVPMk7EBofBhaTJ7vFIW7pZT0zhIHH/cKMeqz72z1b/OZIpUPX/0TQIfzQHA61SkvhFLaHNqBnEJX5Z1R3A1Ocj62dNYT9ADhH3CzORUJ3vl6XnQCcjQLR/9Xk0sDwobc6svZqtsr+ir2Q/FSUPnIXpOsywxWagyF1JHlj4Y0pdCJPdYwPCA8dqqGmcZEsrEXcjm4iflIDpscnJCBDl1wXGKi0K5A8sLccird8RMl6Gnvi8iMR/CIQvmqPxiR8ZPc5lTrFV0kiTOIcN/L1s6SFxM8lxXkh6j0/ykwT0+M+N/wEsHs8kt0wh8onoC+ImMu14jvtzaAe9lFXKi1QQ+klLo7B3FTh3iJTBBaTVJJI2cUl9qPv5lGFlDhdKE4+YlhHFapATmq8HJSYM4PGzIKSFIPb+6A39TE8/CYL7xSP7bFAWuq2Q7LHgkM2ocvcYvgDPpq55P1OrHZn63E/hfv9alN5aWLeMRf7fwMGvURq4IWrxaUa8OUntQ1lncfWvQJky5doc4reKVNFYXQalvQmU8yvvsrTaB7y3e+frYRkSBqjBD8uKNveCWE+jx/dTZXbX7ydGo+2ZorxgA8mKPP9FeX5OswQZ6hkQ//Y2vI0Wl0iBqvhH0bVfAfQjme4cyH0BiLFS4WuIfyDEP9GGMKu6/bdYxK+QRfXy9jZhq0aPiEsYoMK/CUP4AawRdmbevROoB1QYvaD7kLn5tliMtTlx34+LSeVt55tBl1JnuxTznOX14ISEAWL+PLOQ/dB4p1iNnlZUpX/NfX2UBsSYpjpBvGC0qB20xbVJrkAWvX+E+Ybn3j3v/0KUeqFnnh4NnqwBIv4+FpQr07MfB5GLbyIxf1yU59rto2h1A5OoI8MU0iD++OczazbrtFqHadXnEZukIcCSESDCb8wSv/j3mceAV24uX7p0OYwaFygsSseGAbPeOIuef1QYjDNN/Pyk1BCmVU1F/NIeCQM4qSIvod2cXZAh/rzoqj9qI94UcaRVzCnlG9FqGydmBurQMupzLsTfEI6ufNugdkO4b83qC371mlZHXD9qdp37qAGhxH8UVsRtuE8pj/ifQgFjdE2/r44KS0aAKD9DM1LWatqDM1wWuofqEqfTmFNmfjC+g+TkzbjhA0Se+2gOFI+LoKfnSxigfv7gO8zDz2IRGmovINVlTbKlmmHOGVikjOp/CVtvG0VZr4wy6j5rMgXq/l/0AVWQLbM1ShG/mEmij3Qa6g1PMiLFJ36x721V2zHKfNz9n9+9NUhGgO5qf40Kg0YTdEd1m8suOL9q+PBcVA1TN0L42+XHx3ieRrk7QfxvxsjbcFkSBojyS8W7TmWCmCveQu97zWwCHBeOOCvlOQxhqFhlxXe2mymmA+L/X0aa58JLbZ7UhAGi/OsUzqDSausooBaY74h7CMK7H6nOo9gLiFw/UmCuvzZSnmthv/UjZQgDykiW9ob4HwgDa7a0hAGi/PEW455kOITYqyS4zK8DjldVxs/nw2pZ9YKvlMXYHYgbxHbjurClZJmlAX5kgb0zsv5nS4M2F0SiChHxf0OUMve+iGsVCLydHv1z7pO5f2YuhZdlOX/3RgxlYjqPRZFuQXSJTgDfEeAu11Am82Vi2BKgNu32EBexBRoTLGEAz//KYrQXk5L2uERuK84Qfgde3MRZbYAj3koFzQSqF6LOG9AgTYK1BRIGsDZL9SON57dh5mC6EZS2G4Tfu8Kl/hMb5b1cDncrXFaPRZcwQI1/nTm5ph2BZoDKcnleIFw1Fx3VC1BrPp21R7sLKInPtEDCAFWmhKwYU+wFxPPDIIhejGSq1e4/QPzDkPQ8WOXPahj01foRDdNAvh8SHM5ZjL+Yo5gGIDpdH1LfDqJf0BdPDPjx7C8MZn/h4xh5mzZLwgCev94sgmehhiCqCIExilkUFGIcsxL3Adz7c69du4rjWsXJmMurc5jyzOQ5CR4tULsf5VGpegTFteBgYxGWOSmmErL58j9Ts6Pbqg5Boe2d8pE1J4aEASL8d0wNd2E6c28E0FqBiD+gkzitcUwlxbG1qnw9lZNog0b5G4FxZhUFsrowYrqocZ2u1coYylyXEH/5zZ2oQkRrw1osYsNqgiI0dgKtalQy3QlrJv+0hAH826yWOYTw78FCbBTSnUR9uQotnzBAFRq1bJQZyc69SJTOY6rjOuWx7GISBIlXiHqjgQ/o8cegFHFTosJQm1+TjAC1aWd3KRrrXjmAI8UBFjepp5OFrbupqpGSMEC0Vq30BtPXFPsovf1DGMk8Pvuc4BLWYdGqmkD5tEDCANFa6zXAynEXLvYDE+jpH0aS8zA2A68kPX20hq82VLIRFqGFjYWWQgoTcEJM6SBG528AJq7LxZmt3N/UY3F2lYS6a4GEASL+EqPGPBOXJBrnuApiDrC0Shlrq6+I+9K898JKbHsswkRpIglJCyQtkLRAvbfA/we0RWiJe45aBAAAAABJRU5ErkJggg==",
						"",
						""
					],
					"version": 1,
					"changelog": [],
					"style": {
						"mainColor": "ff5c00",
						"fontColor": "fff"
					},
					"browsing_filter": {
						"urls": [
							"https://*.streamr.com/*"
						]
					},
					"browsing_extraInfoSpec": [						
					],
					"browsing": [
						{
							"name": "PageNotFound",
							"title": "Page Not Found",
							"hook": "response",
							"description": "",
							"viewGroup": "Debug",
							"pattern": [
								{
									"statusCode": 404
								}
							],
							"is_enabled": true
						},
						{
							"name": "InternalSeverError",
							"title": "Internal Server Error",
							"hook": "response",
							"description": "",
							"viewGroup": "Debug",
							"pattern": [
								{
									"statusCode": 500
								}
							],
							"is_enabled": true
						}
					],
					"content_matches": [
						"*://*.streamr.com/*"
					],
					"content": [
						{
							"name": "Errors",
							"description": "",
							"title": "Errors",
							"viewGroup": "Debug",
							"type": "event",
							"is_enabled": true,
							"events": [
								{
									"selector": "",
									"event_name": "error"
								}
							],
							"objects": [
								{
									"selector": "",
									"property": "location",
									"name": "url",
									"type": "url"
								},
								{
									"selector": ".",
									"property": "colno",
									"name": "columnNumber",
									"type": "text"
								},
								{
									"selector": ".",
									"property": "filename",
									"name": "filename",
									"type": "url"
								},
								{
									"selector": ".",
									"property": "lineno",
									"name": "lineNumber",
									"type": "text"
								},
								{
									"selector": ".",
									"property": "message",
									"name": "MessageError",
									"type": "text"
								}
							]
						},
						{
							"name": "ConsoleErrors",
							"description": "",
							"title": "Console Errors",
							"viewGroup": "Debug",
							"type": "log",
							"is_enabled": true
						},
						{
							"name": "ConsoleWarns",
							"description": "",
							"title": "Console Warnings",
							"viewGroup": "Debug",
							"type": "log",
							"is_enabled": true
						},
						{
							"name": "ConsoleLogs",
							"description": "",
							"title": "Console Logs",
							"viewGroup": "Debug",
							"type": "log",
							"is_enabled": true
						}
					],
					"survey_matches": [
						"*://*.streamr.com/*"
					],
					"survey": [{
						"name": "UX Survey",
						"title": "UX Survey",
						"is_enabled": true,
						"viewGroup": "Survey",
						"pages": [
							{
								"name": "Profession",
								"elements": [
									{
										"type": "dropdown",
										"name": "question1",
										"title": "Please select the category that best describes your profession: ",
										"choices": [
											{
												"value": "Art",
												"text": "Art"
											},
											{
												"value": "Education",
												"text": "Education"
											},
											{
												"value": "HealthCare",
												"text": "HealthCare"
											},
											{
												"value": "Media",
												"text": "Media"
											},
											{
												"value": "Sales/Marketing",
												"text": "Sales/Marketing"
											},
											{
												"value": "Student",
												"text": "Student"
											},
											{
												"value": "IT/Technology",
												"text": "IT/Technology"
											},
											{
												"value": "Other",
												"text": "Other"
											}
										]
									}
								]
							},
							{
								"name": "Accessiblity",
								"elements": [
									{
										"type": "radiogroup",
										"name": "question2",
										"title": "Was the information easy to find? ",
										"choices": [
											{
												"value": "Yes",
												"text": "Yes"
											},
											{
												"value": "No",
												"text": "No"
											}
										]
									},
									{
										"type": "radiogroup",
										"name": "question3",
										"title": "Was the information clearly presented?",
										"choices": [
											{
												"value": "Yes",
												"text": "Yes"
											},
											{
												"value": "No",
												"text": "No"
											}
										]
									},
									{
										"type": "radiogroup",
										"name": "question4",
										"title": "Were you able to find what you were looking for?",
										"choices": [
											{
												"value": "Yes",
												"text": "Yes"
											},
											{
												"value": "No",
												"text": "No"
											}
										]
									}
								]
							},
							{
								"name": "OtherInformation",
								"elements": [
									{
										"type": "comment",
										"name": "question5",
										"title": "What other information should we provide on our website?"
									},
									{
										"type": "comment",
										"name": "question6",
										"title": "How could we make the site easier to use?"
									}
								]
							},
							{
								"name": "Overall",
								"elements": [
									{
										"type": "matrix",
										"name": "question7",
										"title": "Overall, how would you rate our site?",
										"columns": [
											{
												"value": 1,
												"text": "Gtreat"
											},
											{
												"value": 2,
												"text": "Good"
											},
											{
												"value": 3,
												"text": "Average"
											},
											{
												"value": 4,
												"text": "Fair"
											},
											{
												"value": 5,
												"text": "Poor"
											}
										],
										"choices": [
											1,
											2,
											3,
											4,
											5
										],
										"rows": [
											"Accessibility",
											"Content",
											"Presentation"
										]
									}
								]
							}
						]
					}],
				}
			},
			{
				name: 'ggAdv',
				domain: '*.google.com',
				isOwner: 'no',
				tasks: ['debug'],
				pay: '50k DAT',
				module: {}
			}
		];
		const saveToModules = () => {
			let modules = this.state.modules;
			let resModules = {};
			let counter = 0;
			for(let moduleId in modules){
				counter++;
				let id = 'cb' + counter;
				if(document.getElementById(id).checked)
					resModules[modules[moduleId].name] = modules[moduleId].module					
			}
			window.helper.saveModule(resModules).then(x => {
				this.props.reload();
			});
		};
		const search = (e) => {
			if (e.key != 'Enter') {
				return;
			}
			let query = document.getElementById("search").value;
			var result = [];
			let id = 0;
			this.state.modules = [];
			for(let module of modules){
				if(module.name.toLowerCase().indexOf(query) >= 0 || module.domain.toLowerCase().indexOf(query) >= 0)
				{
					this.state.modules.push(module);
					id++;
				}
			}
			this.setState({rows:this.generateRows(this.state.modules)});
		}
		return (
		<MDBRow>
			<MDBCol md="12">
				<MDBCard className="mt-5">
					<MDBView className="gradient-card-header blue darken-1">
						<h4 className="h4-responsive text-white">Search New Module</h4>
					</MDBView>
					<MDBCardBody>
						<MDBCol md="10">					
							<div className="input-group-prepend">
								<span  id="basic-text1">
									<MDBIcon icon="search" />
								</span>
								<input id="search" onKeyPress={search} className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" />					
							</div>
						</MDBCol>
						<br/>
						<MDBTable btn fixed>
						  <MDBTableHead columns={data_icons.columns} />
						  <MDBTableBody rows={data_icons.rows} />
						</MDBTable>
						<Fragment>
						  <MDBBtn active onClick={saveToModules} color="primary">Save To Modules</MDBBtn>
						</Fragment>
					</MDBCardBody>
				</MDBCard>
			</MDBCol>
		</MDBRow>
	  );
  }
}

export default withRouter(Marketplace);