import filledStars from '../utils/images/Filled Star.png'
import { useState } from 'react'
import unFilledStar from '../utils/images/UnfilledStar.png'
const StarRating = () => {

    const [filledStar, setFilledStar] = useState(null)
    const [onhover, setOnhover] = useState(null)

    const handleStarClicked = (index) => {
        setFilledStar(index)
    }
    const handleMouseEnter = (index) => {
        setOnhover(index)
    }
    const handleMouseLeave = () => {
        setOnhover(null)
    }

    return (
        <div style={{ display: "flex", gap: '4px' }}>
            {Array(5).fill(null).map((_, index) => (
                <div key={index}>
                    <img src={(onhover !== null && index <= onhover) || (onhover === null && filledStar !== null && index <= filledStar) ? filledStars : unFilledStar}
                        style={{ width: "20px" }}
                        onClick={() => handleStarClicked(index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave} />
                </div>
            ))}

        </div>
    )
}

export default StarRating