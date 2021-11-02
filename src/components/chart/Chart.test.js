import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Chart from './Chart';
import data2020 from "../../data/2020.json";
import { GOALS_LIST } from "../../config";

const dimensions = {
    width: 300,
    height: 300,
    margin: { top: 30, right: 30, bottom: 30, left: 30 }
}

describe("<Chart />", () => {

    test('Renders the component with no data values', () => {
        var component = mount(<Chart dimensions={dimensions}></Chart>)

        expect(toJson(component)).toMatchSnapshot();
    })

    test('Renders the component with default values', () => {
        var component = mount(<Chart data={data2020} dimensions={dimensions} />)

        expect(toJson(component)).toMatchSnapshot();
    })


    test('Renders the component with default and goal values', () => {
        var component = mount(<Chart data={data2020} goal={GOALS_LIST[0].id} dimensions={dimensions} />)

        expect(toJson(component)).toMatchSnapshot();
    })
})