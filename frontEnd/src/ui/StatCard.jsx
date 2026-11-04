import styled from "styled-components"

const StyledStatCard = styled.div`
background: white;
padding: 2rem;
border-radius: 1rem;
h3{
    font-size: 1.6rem;
}
p{
    font-size: 2.4rem;
    font-weight:600
}
span{
    width: 2rem;

}
 `
const StatCard = ({ title, value, icon }) => {

    const Icon = icon
    return (
        <StyledStatCard>
            <h3>{title}</h3>
            <span><Icon /></span>
            <p>{value}</p>
        </StyledStatCard>
    )
}

export default StatCard