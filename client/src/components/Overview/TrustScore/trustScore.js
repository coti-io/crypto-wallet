import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import styled from "styled-components";
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GradientSVG from "./gradient";
import './style.css';


const TrustScoreContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0px 2px 3.9px 0.1px rgba(0, 0, 0, 0.15);
    padding: 20px;
    box-sizing: border-box;
    @media(max-width: 1201px){
        padding: 20px 10px;
    }
    @media(max-width: 768px){
        padding-bottom: 40px;
        margin-bottom: 20px;
    }
`;

const BoxHeading = styled.h3`
    display: flex;
    margin: 0;
    align-items: center;
    font-family: ClanOT-Medium;
    font-size: 12px;
    font-weight: semi-bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.3px;
    text-align: left;
    color: #001111;
    & img {
        max-width: 21px;
        max-height: 23px;
        width: 100%;
        height: 100%;
        margin-right: 11px;
    }
`;

const DivRow = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    @media(max-width: 768px){
        flex-direction: column-reverse;
    }
`;  

const ScoreHolder = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 160px;
    height: 160px;
    background: transparent;
    @media(max-width: 768px){
        margin: 33px 0 30px 0;
    }
`;


const UpgradeTS = styled.button`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-evenly;
    max-width: 340px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    border: none;
    font-family: ClanOT-Medium;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1.8px;
    text-align: center;
    color: #ffffff;
    cursor:not-allowed;
    padding-top: 4px;
    background-color: #50e3c261;
    box-sizing: border-box;
    pointer-events: none;
    outline: none;
    & img {
        max-width: 18px;
        max-height: 18px;
        width: 100%;
        height: 100%;
        margin-bottom: 3px;
    }

    &:focus {
        outline: none;
    }
    @media(max-width: 768px){
        font-size: 18px;
        margin: 0 2% 0 1%;
        & img {
            margin: 0 1% 0 0;
        }
    }
    @media(max-width: 420px){
        
        font-size: 13px;

        & img {
            max-width: 12px;
            max-height: 12px;
        }
    }
`;

const CommingSoon = styled.div`
    position: absolute;
    top: 56px;
    color: #50e3c2;
    font-size: 15px;
    font-family: ClanOT-Medium;
    right: 0;
    font-weight: bold;
    @media(max-width: 1080px){
        margin: 0 auto;
        width: 100%;
    }
`;
class TrustScore extends Component {


    render() {
        
        return (
            <TrustScoreContainer>
                <BoxHeading>
                    <img src={require('../../../images/sections/trust-score.svg')} alt="ts"/>
                    {"Trust Score"}
                </BoxHeading>
                <DivRow>
                    <UpgradeTS>
                        <img src={require('../../../images/sections/upgrade-score.svg')} alt="upgrade"/>
                        {"Upgrade Trust Score"}
                        <CommingSoon>COMING SOON!</CommingSoon>
                    </UpgradeTS>
                    <ScoreHolder>
                        <CircularProgressbar initialAnimation strokeWidth="3" percentage={this.props.trustScore} textForPercentage={(pct) => `${pct}`}/>
                    </ScoreHolder>
                </DivRow>
                <GradientSVG  gradientTransform="90" startColor="#50e3c2" middleColor="#50e3c2" endColor="#50e3c2" idCSS="progreesGradient" />
            </TrustScoreContainer>
        );
    }
}
const mapStateToProps = ({account}) => {
    return {
        trustScore: account.trustScore
    };
}


export default connect(
    mapStateToProps,
)(withRouter(TrustScore));


