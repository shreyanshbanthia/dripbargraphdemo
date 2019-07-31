import { shallowMount } from "@vue/test-utils";
import BarGraph from "@/components/BarGraph.vue";

describe("BarGraph.vue", () => {
  it("renders canvas with graph when passed prop array", () => {
    const arrData = new Array();
    arrData[0] = "2007:750:rgb(73,160,216)";
    arrData[1] = "2008:425:rgb(211,83,160)";
    arrData[2] = "2009:960:rgb(255,197,39)";
    arrData[3] = "2010:700:rgb(223,76,39)";
    arrData[4] = "2011:800:rgb(228,49,78)";
    arrData[5] = "2012:975:rgb(201,231,221)";
    arrData[6] = "2013:375:rgb(35,71,67)";
    arrData[7] = "2014:775:rgb(255,255,5)";
    const wrapper = shallowMount(BarGraph, {
      propsData: { dataArr: arrData }
    });
    expect(wrapper.find("canvas")).toMatchSnapshot();
  });
});
