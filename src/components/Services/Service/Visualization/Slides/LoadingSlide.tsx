import NoProgressSlide from './NoProgressSlide'
import ProgressSlide from './ProgressSlide'

interface LoadingSlideProps {
    progress?: number
}

function LoadingSlide({ progress } : LoadingSlideProps) 
{
    return (
        <>
            {
                !progress ?
                    <NoProgressSlide/>
                :
                    <ProgressSlide progress={progress}/>
            }            
        </>
    )
}

export default LoadingSlide