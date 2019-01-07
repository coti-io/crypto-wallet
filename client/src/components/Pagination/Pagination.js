import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 60px;
    @media(max-width: 768px){
        justify-content: space-between;
        padding: 15px 20px 0;
    }
`;

const Direction = styled.div`
    font-family: ClanOT-News;
    font-size: 12px;
    cursor: pointer;
    & > span:nth-child(2){
        display: none;
    }
    @media(max-width: 768px){
        width: 40px;
        height: 40px;
        background-color: #f8f8f8;
        border-bottom: 1px solid #ebebeb;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        & > span:nth-child(2){
            display: initial;
        }
        & > span:first-child{
            display: none;
        }
    }
`

const Numbers = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
`

const Number = styled.div`
    font-family: ClanOT-News;
    font-size: 12px;
    color: ${props => props.active ? '#ffffff' : '#333333'};
    background: ${props => props.active ? '#2bbfdf' : null};
    width: 36px;
    height: 36px;
    border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
`

class Pagination extends Component {

    state = {
        active: 1
    }


    async componentWillReceiveProps(nextProps){
        if(nextProps.array > this.props.array){
            await this.setState({...this.state, active: Math.ceil(nextProps.array/nextProps.maxRows)});
            const page = this.props.addresses ? Math.ceil(nextProps.array/nextProps.maxRows) : 1;
            this.setPage(page, nextProps.array)
        }
    }

    setPage(page, nextPropsArray){
        if(page > Math.ceil(this.props.array/this.props.maxRows) || page < 1){
            return
        }
        
        let to = page*this.props.maxRows;
        let from = to - this.props.maxRows;
        this.props.setFilterdRows(from, to); 
        this.setState({...this.state, active: page});
    }


    drawPages(){
        const limit = this.props.maxPages;
        let start;
        let end;
        const pages = [];
        let totalPages = Math.ceil(this.props.array/this.props.maxRows);
        if(totalPages <= limit){
            start = 0;
            end = totalPages;
        }
        else{
            let maxPagesBeforeCurrentPage = Math.floor(limit / 2);
            let maxPagesAfterCurrentPage = Math.ceil(limit / 2) - 1;
            if(this.state.active <= maxPagesBeforeCurrentPage){
                start = 0;
                end = limit;
            }
            else if(this.state.active + maxPagesAfterCurrentPage >= totalPages){
                start = totalPages - limit;
                end = totalPages;
            }
            else{
                start = this.state.active - maxPagesBeforeCurrentPage - 1;
                end = this.state.active + maxPagesAfterCurrentPage;
            }
        }
        for(let i = start ; i < end; i++){
            pages.push(<Number key={i} active={this.state.active === i+1} onClick={() => this.setPage(i+1)}>{i+1}</Number>)
        }
        return pages;
    }

    render() {
        return (
            this.props.array > this.props.maxRows ?
            <Container>
                <Direction prev onClick={() => this.setPage(this.state.active - 1)}>
                    <span>{"< PREV"}</span>
                    <span>{"<"}</span>
                </Direction>
                <Numbers>
                    {this.drawPages(this.props.array)}
                </Numbers>
                <Direction onClick={() => this.setPage(this.state.active + 1)}>
                    <span>{"NEXT >"}</span>
                    <span>{">"}</span>
                </Direction>
            </Container>
            :
            null
        )
    }
}


export default Pagination;


