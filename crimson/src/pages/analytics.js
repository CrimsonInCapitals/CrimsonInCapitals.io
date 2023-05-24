import '../styling/analytics.css';
import { useEffect, useReducer, useState } from 'react';
import React from 'react';
import { useThemeContext } from '../context/theme';
import { useCookiesContext } from '../context/cookies';
import TunnelGraph from '../components/analytics/tunnel';
import { Card,Section } from '../components/analytics/Card';
import { RequestForm } from '../components/analytics/Form';
import { Login } from '../components/analytics/Login';
import { CookieBar } from '../components/cookierequest';
import { CH1, H1 } from '../components/StyledComponents';
import { useFacebookContext } from '../context/facebook';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Posts } from '../components/analytics/Posts';
//import { LoginSocialFacebook } from 'reactjs-social-login';
//import facebook

ChartJS.register(ArcElement);

export const Analytics = ()=> {
    const facebook=useFacebookContext()
    const callInsights=(Data,f)=>{
        if(!Data)return
        let access_token = Data.page.access_token
        let since = Data.since
        let until = Data.until
        let metric = Data.metric
        let period = Data.period? Data.period:'day'
        window.FB.api('/me/insights','GET',
            {metric,since,until,period,access_token},
            function(response) {
                if(f){f(response)}
            }
        );

    }

    const FacebookTunnelData=(Data)=>{
        Data.since = new Date(Date.now()-31*86400000).toISOString()
        Data.metric = 'page_impressions,page_engaged_users,page_views_total,page_website_clicks_logged_in_unique'
        Data.period = 'month'
        callInsights(Data,console.log())

    }
    const pageDate = true
    const pieData={
        labels: ['Red', 'Yello', 'Purple', 'Blue'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5],
            backgroundColor: [
              '#EA4335',
              '#FBBC04',
              '#D00DAC',
              '#1877F2',
            ],
           
            borderWidth: 0,
          },
        ],
      }
      useEffect(()=>{console.log(facebook)},[facebook])
    return (
        <>
            <section>
                <H1>Welcome {facebook.user && facebook.user.first_name}</H1>
                {facebook.pages && <RequestForm pages={facebook.pages} submit={(formData)=>callInsights(formData,console.log)}/>}
            </section>
            {facebook.status !== 'connected' && <Login/>}

            {facebook.pages &&
            <>
                {facebook.pages.summary.map((page,index)=>(index===0&&
                    <Card key={page} heading={facebook.pages[page].name}>
                        <Posts page={facebook.pages[page]}/>
                        {/* <InstagramPosts page={page}/> */}
                    </Card>
                ))}
                {/* <Card>
                    <Section>
                        <aside>
                            <CH1>Conversion Tunnel</CH1>
                        </aside>
                        <section>
                            <TunnelGraph data={
                                [{value:5,text:'impressions'},
                                    [{value:4,text:'engagment'},
                                        [{value:1,text:'clicks'}]]]
                            }/>
                        </section>
                    </Section>
                    <Posts page={facebook.pages[0]}/>
                    {pageDate.data.map((Point)=>(
                        <Section>
                            <h2>{Point.title}</h2>
                            <details>
                                <summary>Description</summary>
                                <p>{Point.description}</p>
                            </details>
                        </Section>
                    ))}
                </Card> */}
                <Card>
                    <Section>
                    <aside>
                        <CH1>Website visitors origin</CH1>
                    </aside>
                    <section>
                        <Doughnut data={pieData}/>
                  </section>
                  </Section>
                </Card>
                </>
            }
              <CookieBar/>
        </>
    );
}