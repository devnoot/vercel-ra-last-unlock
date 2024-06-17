import { buildAuthorization, getUserRecentAchievements } from "@retroachievements/api";
import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { URL } from 'url'

const username = process.env.NEXT_PUBLIC_RA_API_USER
const webApiKey = process.env.NEXT_PUBLIC_RA_API_KEY

const BANNER_HEIGHT = 200 
const BANNER_WIDTH = 800 

const authorization = buildAuthorization({ username, webApiKey })

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request) {

  //const url = new URL('../../../../assets/kongtext.ttf', import.meta.url)

  //const fontData = await fetch (url).then(res => res.arrayBuffer())

  const [cheevo] = await getUserRecentAchievements(authorization, { username: 'noot', recentMinutes: 10080 })

  const badgeUrl = `https://retroachievements.org${cheevo.badgeUrl}`

  const boxShadow = '1px 1px #e7dfe7, -1px -1px #e7dfe7, 1px -1px #e7dfe7, -1px 1px #e7dfe7, 0 -2px #9c9a9c, -2px 0 #7b757b,0 2px #424542'

  const basePStyles = {
    padding: 0,
    margin: 0,
    textShadow: "2px 2px #212421, 1px 1px #212021",
    fontSize: "1rem",
    margin: "8px 0"
  }

  return new ImageResponse(
    (
      <div 
        style={{
          display: 'flex',
          width: BANNER_WIDTH,
          height: BANNER_HEIGHT,
          backgroundImage: 'linear-gradient(to bottom,  #04009d 0%,#06004d 100%)',
          color: 'white',
          border: '4px solid #FFFFFF',
          borderRadius: '8px',
          boxShadow
      }}>

        <img src={badgeUrl} style={{ height: BANNER_HEIGHT - 8, width: BANNER_HEIGHT - 8, imageRendering: 'crisp-edges' }} />

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          <p style={{...basePStyles, marginLeft: 8 }}>Last unlock on {new Date(cheevo.date).toDateString()}</p>
          <p style={{ ...basePStyles, marginLeft: 8 }}>{cheevo.gameTitle} on {cheevo.consoleName}</p>
          <p style={{ ...basePStyles, paddingLeft: 8, marginTop: 32, width: '100%' }}><strong>{cheevo.title}</strong></p>
          <p style={{ ...basePStyles, paddingLeft: 8, width: '100%' }}>{cheevo.description}</p>
        </div>

      </div>
    ),
    {
      width: BANNER_WIDTH,
      height: BANNER_HEIGHT ,
      // fonts: [
      //   {
      //     name: 'kong',
      //     data: fontData,
      //     weight: 400,
      //     style: 'normal'
      //   }
      // ]
    }
  )
}
