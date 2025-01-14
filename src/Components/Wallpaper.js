import { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import '../Styles/wallpaper.css';

const constants = require('../constants');
const API_URL = constants.API_URL;

class Wallpaper extends Component {

    constructor() {
        super();
        this.state = {
            text: '',
            restaurants: [],
            suggestions: []
        };
    }

    onOptionsChange(event) {
        const city_id_city_name = event.target.value;
        const city_id = city_id_city_name.split('_')[0];
        const cityName = city_id_city_name.split('_')[1];
        localStorage.setItem("city_id", city_id);

        axios.get(`${API_URL}/api/getRestaurantByLocation/${cityName}`)
            .then(result => {
                this.setState({
                    restaurants: result.data.restaurants
                });
            }).catch(error => {
                console.log(error);
            });
    }

    onTextChange = (event) => {
        const searchtext = event.target.value;
        const  { restaurants } = this.state;
        let restSuggestions = [];

        if (searchtext.length > 0) {
            restSuggestions = restaurants.filter(item => (item.name.toLowerCase()).includes(searchtext.toLowerCase()))
        }
       
        this.setState({
            text: searchtext,
            suggestions: restSuggestions
        });
    }

    goToRestaurant(item) {
        const url = `/details?id=${item._id}`;
        this.props.history.push(url);
    }

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length == 0) {
            return null;
        }
        return (
            <ul className="suggestionsBox">
                {
                    suggestions.map((item, index) => {
                        return (
                            <li key={index} onClick={() => this.goToRestaurant(item)}>
                                <div className="suggestionImage">
                                    <img src={require('../' + item.image).default} alt="myimg"/>
                                </div>
                                <div className="suggestionText w-100">
                                    <div>
                                        {item.name}, {item.locality}
                                    </div>
                                    <div className="text-muted">
                                        Rating: {item.aggregate_rating}
                                        <span className="text-danger float-end">
                                            Order Now &#8594;
                                        </span>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        );
    }

    render() {
        const { cities } = this.props;
        return (
            <>
                <img src={require('../Assets/homepageimg.png').default} className="homeImage" alt="homeimage" />
                <div className="imageText">
                    <div className="logo">
                        e!
                    </div>
                    <div className="headerText">
                        Find the best restaurants, cafés, and bars
                    </div>
                </div>
                <div className="locationOptions row">
                    <div className="col-12 col-md-5 location-wrapper text-md-end text-center">
                        <select className="locationDropDown" onChange={(event) => this.onOptionsChange(event)}>
                            <option value="0" disabled selected>Select location</option>
                            {
                                cities.map((item, index) => {
                                    return <option key={index} value={item.city_id + '_' + item.city}>{item.name}, {item.city}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-12 col-md-7 search-wrapper text-md-start text-center">
                        <input className="restaurantSearch" type="text" placeholder="Search for the restaurants" onChange={this.onTextChange}/>
                        {
                            this.renderSuggestions()
                        }
                    </div>  
                </div>
            </>
        );
    }
}

export default withRouter(Wallpaper);