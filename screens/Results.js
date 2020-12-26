import React, {Component} from 'react';
import {
    View,
    SafeAreaView, ScrollView, StyleSheet, Text, Modal, FlatList
} from 'react-native';

// import {LineChart} from 'react-native-chart-kit';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Title from '../components/Title/Title';
import LineChart from 'react-native-responsive-linechart';
import {LineChart as LineChartSVG} from 'react-native-svg-charts'
import {Grid, YAxis, XAxis} from 'react-native-svg-charts'
import ToggleTitle from "../components/ToggleTitle/ToggleTitle";
import Button from "../components/Button/Button";
import ResultTable from "../components/ResultTable/ResultTable"
import ModalWindow from "../components/ModalWindow/ModalWindow";
import Svg, {
    Rect
} from 'react-native-svg';
import ColorDescription from "../components/ColorDescription/ColorDescription";

/*const ResultTable = (props) => {
    const data = props.data || [];
    const dataRows = data.map((item, i, arr) => {
        return <View key={Math.random() * 100000} style={{
            display: 'flex',
            flexDirection: 'row',
            borderBottomColor: '#EAEAEA',
            backgroundColor: ((i + 1) % 2 === 0 ? '#FAFAFA' : '#FFFFFF'),
            borderBottomWidth: (i + 1 < arr.length ? 1 : 0),
        }}>
            <View style={{padding: 10, flexBasis: 80}}><Text>Год {i}</Text></View>
            <View style={{
                padding: 10,
                borderLeftWidth: 1,
                borderLeftColor: '#EAEAEA',
            }}><Text>{typeof item === "string" ? item : item.toFixed(2)}{props.format && typeof item !== "string" ? " " + props.format : ""}</Text></View>
        </View>;
    });
    return <View style={{marginHorizontal: 16, marginTop: 10, borderWidth: 1, borderColor: '#EAEAEA', padding: 0}}>
        {dataRows}
    </View>;
};*/

class Results extends Component {

    static navigationOptions = ({screenProps}) => {
        return {
            title: 'Результат'
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            modal: {
                isON: false,
                window: null
            }
        };

        this.InvestmentEvaluation = props.navigation.getParam("InvestmentEvaluation", [0]);
        this.dataCashFlow = props.navigation.getParam('CashFlow', [0]);
        this.mainCoeff = props.navigation.getParam("MainCoeff", [0]);
        this.breakevenObj = props.navigation.getParam('BreakEven', [0]);

        this.GoToParamsVariety = this.GoToParamsVariety.bind(this);
    }

    GoToParamsVariety(force) {
        let badReasons = this.CheckProject();

        if (badReasons.length > 0 && force === false) {
            this.setState({
                modal: {
                    ...this.state.modal,
                    window: <ModalWindow header={"Инвестиционный проект неэффективен"}
                                         description={"Основной сценарий Вашего инвестиционного проекта оказался неэффективным в следующих показателях"}
                                         data={badReasons}
                                         buttons={[<Button title={"Изменить входные параметры"}
                                                           key={Math.random() * 100000} onPress={() => {
                                             this.props.navigation.goBack()
                                         }}></Button>,
                                             <Button key={Math.random() * 100000} title={"Всё равно продолжить"}
                                                     bgColor={"grey"} onPress={() => {
                                                 this.GoToParamsVariety(true)
                                             }}></Button>]}/>,
                    isON: true
                }
            });
        } else {
            this.setState({
                modal: {
                    ...this.state.modal,
                    isON: false
                }
            }, () => {
                this.props.navigation.navigate("Variation", {Business: this.props.navigation.getParam("Business", [0])})
            })
        }
    };

    CheckProject() {
        let reasons = [];

        if (this.mainCoeff.CurrentRatio[this.mainCoeff.CurrentRatio.length - 1] < 1.5) {
            reasons.push("Неприемлимое значение текущей ликвидности (< 1.5)");
        }
        if (this.mainCoeff.InterestCoverage[this.mainCoeff.InterestCoverage.length - 1] < 1.5) {
            reasons.push("Неприемлимое значение покрытия процентов (< 1.5)");
        }
        if (this.mainCoeff.ROS[this.mainCoeff.ROS.length - 1] < 1.5) {
            reasons.push("Неприемлимое значение рентабельности продаж ROS (< 5%)");
        }
        if (this.mainCoeff.ROA[this.mainCoeff.ROA.length - 1] < 5) {
            reasons.push("Неприемлимое значение рентабельности активов ROA (< 5%)");
        }

        if (this.breakevenObj.BreakevenCoef < 1.7) {
            reasons.push("Неприемлимое значение индекса безубыточности (< 1.7)")
        }

        if (this.InvestmentEvaluation.CurrentNPV[this.InvestmentEvaluation.CurrentNPV.length - 1] < 0) {
            reasons.push("Неприемлимое значение чистой текущей стоимости (< 0)")
        }
        if (this.InvestmentEvaluation.ProfitabilityIndex < 1) {
            reasons.push("Неприемлимое значение индекса доходности (< 1)")
        }
        if (this.InvestmentEvaluation.PaybackIndex > 1) {
            reasons.push("Неприемлимое значение индекса окупаемости (> 1)")
        }

        if (reasons.length > 0) {
            reasons.forEach((item) => {
                reasons.push({key: item});
            });
            reasons.splice(0, reasons.length / 2);
        }

        return reasons;
    }

    render() {
        const breakevenQuantity = [
            0,
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.2),
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.4),
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.6),
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.8),
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2)
        ];


        const breakevenRevenue = [
            0,
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.2) * this.breakevenObj.AvgWeightedUnitPrice,
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.4) * this.breakevenObj.AvgWeightedUnitPrice,
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.6) * this.breakevenObj.AvgWeightedUnitPrice,
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.8) * this.breakevenObj.AvgWeightedUnitPrice,
            parseInt(this.breakevenObj.CriticalSalesQuantity * 2) * this.breakevenObj.AvgWeightedUnitPrice,
        ];

        const breakevenExpenses = [
            this.breakevenObj.FixedCosts,
            this.breakevenObj.FixedCosts + parseInt(this.breakevenObj.CriticalSalesQuantity * 2 * 0.2 * this.breakevenObj.VariableCostsPerUnit),
            parseInt(this.breakevenObj.FixedCosts + this.breakevenObj.CriticalSalesQuantity * 2 * 0.4 * this.breakevenObj.VariableCostsPerUnit),
            parseInt(this.breakevenObj.FixedCosts + this.breakevenObj.CriticalSalesQuantity * 2 * 0.6 * this.breakevenObj.VariableCostsPerUnit),
            parseInt(this.breakevenObj.FixedCosts + this.breakevenObj.CriticalSalesQuantity * 2 * 0.8 * this.breakevenObj.VariableCostsPerUnit),
            parseInt(this.breakevenObj.FixedCosts + this.breakevenObj.CriticalSalesQuantity * 2 * this.breakevenObj.VariableCostsPerUnit)
        ];

        const breakevenData = [
            {
                data: breakevenRevenue,
                svg: {stroke: '#8800cc'}
            },
            {
                data: breakevenExpenses,
                svg: {stroke: 'green'}
            }
        ];


        let gridStep = 100;
        if (this.InvestmentEvaluation.CurrentNPV[1]) {
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 1000) {
                gridStep = 10000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 10000) {
                gridStep = 50000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 50000) {
                gridStep = 100000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 100000) {
                gridStep = 500000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 500000) {
                gridStep = 1000000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 1000000) {
                gridStep = 10000000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 10000000) {
                gridStep = 100000000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 100000000) {
                gridStep = 1000000000;
            }
            if (Math.abs(this.InvestmentEvaluation.CurrentNPV[2] - this.InvestmentEvaluation.CurrentNPV[1]) > 1000000000) {
                gridStep = 10000000000;
            }
        }

        const config = {
            line: {
                visible: true,
                strokeWidth: 2,
                strokeColor: '#ffa726',
            },
            area: {
                visible: true,
                gradientFrom: '#ffa726',
                gradientFromOpacity: 0.35,
                gradientTo: '#ffa726',
                gradientToOpacity: 0,
            },
            tooltip: {
                visible: true,
                labelFontSize: 15,
            },
            yAxis: {
                visible: true,
                labelFormatter: v => Math.round(v / 1000) + 'K',
            },
            xAxis: {
                visible: true,
                labelFontSize: 12,
                labelColor: '#777',
            },
            grid: {
                stepSize: gridStep,
            },
            dataPoint: {
                visible: true,
                color: '#ff6312',
                radius: 4,
            },
            insetX: 16,
            insetY: 8,
        };

        return (
            <SafeAreaView>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={styles.contentContainer}
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                    style={styles.scrollView}>
                    <View style={{paddingBottom: 10, paddingTop: 10}}>
                        <Title>Ваш финансовый план</Title>
                    </View>
                    <Text maxFontSizeMultiplier={1} style={styles.commonText}>
                        Основываясь на данных с предыдущего экрана Crona построила финансовый план для Вашего проекта.
                        Вы
                        можете вернуться на экран назад, чтобы изменить входные данные.
                    </Text>
                    <View style={{marginTop: 20}}>
                        <Title>Анализ безубыточности</Title>
                        <View style={{height: 240, padding: 20, flexDirection: 'row'}}>
                            <YAxis
                                data={breakevenRevenue}
                                contentInset={{top: 10, bottom: 10}}
                                svg={{
                                    fill: 'grey',
                                    fontSize: 10,
                                }}
                                numberOfTicks={5}
                                formatLabel={value => `${value}`}
                            />
                            <LineChartSVG
                                style={{flex: 1}}
                                data={breakevenData}
                                contentInset={{top: 10, bottom: 10}}
                            >
                                <Grid/>
                            </LineChartSVG>
                        </View>
                        <XAxis
                            data={breakevenQuantity}
                            contentInset={{left: 50, right: 50}}
                            xAccessor={({item}) => item}
                            svg={{
                                fill: 'grey',
                                fontSize: 12
                            }}
                        />
                        <View style={{marginHorizontal: 16}}>
                            <ColorDescription text="Выручка" colorObject=<Svg
                                              width={"32"} height={"32"}>
                                <Rect
                                    width="24"
                                    height="3"
                                    fill="#8800cc"
                                />
                            </Svg>/>
                            <ColorDescription text="Затраты" colorObject=<Svg
                                              width={"32"} height={"32"}>
                                <Rect
                                    width="24"
                                    height="3"
                                    fill="green"
                                />
                            </Svg>/>
                        </View>
                        <View style={{
                            marginHorizontal: 16,
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: '#EAEAEA',
                            padding: 0
                        }}>
                            <View key={Math.random() * 100000} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderBottomColor: '#EAEAEA',
                                backgroundColor: '#FFFFFF',
                                borderBottomWidth: 0
                            }}>
                                <View style={{padding: 10, flexBasis: 300}}><Text>Критический объём продаж</Text></View>
                                <View style={{
                                    padding: 10,
                                    borderLeftWidth: 1,
                                    borderLeftColor: '#EAEAEA',
                                }}><Text>{parseInt(this.breakevenObj.CriticalSalesQuantity)} шт.</Text></View>
                            </View>
                            <View key={Math.random() * 100000} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderBottomColor: '#EAEAEA',
                                backgroundColor: '#FAFAFA',
                                borderBottomWidth: 1
                            }}>
                                <View style={{padding: 10, flexBasis: 300}}><Text>Коэффициент
                                    безубыточности</Text></View>
                                <View style={{
                                    padding: 10,
                                    borderLeftWidth: 1,
                                    borderLeftColor: '#EAEAEA',
                                }}><Text>{this.breakevenObj.BreakevenCoef.toFixed(2)}</Text></View>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop: 20}}>
                        <Title>Финансовый профиль проекта</Title>
                        <View style={{height: 240}}>
                            <LineChart style={{flex: 1}} xLabels={[0, 1, 2, 3, 4, 5, 6]} config={config}
                                       data={this.InvestmentEvaluation.CurrentNPV}/>
                        </View>
                        <ResultTable data={this.InvestmentEvaluation.CurrentNPV}/>
                    </View>
                    <View style={{marginTop: 20}}>
                        <Title>Динамика остатка денежных средств</Title>
                        <View style={{height: 240}}>
                            <LineChart style={{flex: 1}} xLabels={[0, 1, 2, 3, 4, 5, 6]} config={config}
                                       data={this.dataCashFlow}/>
                        </View>
                        <ResultTable data={this.dataCashFlow}/>
                    </View>
                    <View style={{marginTop: 20}}>
                        <Title>Основные финансовые коэффициенты</Title>
                        <ToggleTitle elemToShow={<ResultTable data={this.mainCoeff.CurrentRatio}/>}>Текущая
                            ликвидность</ToggleTitle>
                        <ToggleTitle elemToShow={<ResultTable data={this.mainCoeff.InterestCoverage}/>}>Покрытие
                            процентов</ToggleTitle>
                        <ToggleTitle elemToShow={<ResultTable data={this.mainCoeff.ROS} format={"%"}/>}>Рентабельность
                            продаж</ToggleTitle>
                        <ToggleTitle elemToShow={<ResultTable data={this.mainCoeff.ROA} format={"%"}/>}>Рентабельность
                            активов</ToggleTitle>
                        <ToggleTitle elemToShow={<View style={{
                            marginHorizontal: 16,
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: '#EAEAEA',
                            padding: 0
                        }}>
                            <View key={Math.random() * 100000} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderBottomColor: '#EAEAEA',
                                backgroundColor: '#FFFFFF',
                                borderBottomWidth: 0
                            }}>
                                <View style={{padding: 10, flexBasis: 300}}><Text>Индекс доходности</Text></View>
                                <View style={{
                                    padding: 10,
                                    borderLeftWidth: 1,
                                    borderLeftColor: '#EAEAEA',
                                }}><Text>{(this.InvestmentEvaluation.ProfitabilityIndex.toFixed(1))}</Text></View>
                            </View>
                            <View key={Math.random() * 100000} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderBottomColor: '#EAEAEA',
                                backgroundColor: '#FAFAFA',
                                borderBottomWidth: 1
                            }}>
                                <View style={{padding: 10, flexBasis: 300}}><Text>Индекс окупаемости</Text></View>
                                <View style={{
                                    padding: 10,
                                    borderLeftWidth: 1,
                                    borderLeftColor: '#EAEAEA',
                                }}><Text>{this.InvestmentEvaluation.PaybackIndex}</Text></View>
                            </View>
                            <View key={Math.random() * 100000} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderBottomColor: '#EAEAEA',
                                backgroundColor: '#FFFFFF',
                                borderBottomWidth: 0
                            }}>
                                <View style={{padding: 10, flexBasis: 300}}><Text>Индекс финансовой реализуемости</Text></View>
                                <View style={{
                                    padding: 10,
                                    borderLeftWidth: 1,
                                    borderLeftColor: '#EAEAEA',
                                }}><Text>{(this.InvestmentEvaluation.FeasibilityIndex.toFixed(1))}</Text></View>
                            </View>
                        </View>
                        }>Финансовая эффективность</ToggleTitle>
                    </View>
                    <Button onPress={() => {
                        this.GoToParamsVariety(false)
                    }} title={"Перейти к методу вариации параметров"}></Button>
                    <View style={styles.centeredView}>{this.state.modal.isON && this.state.modal.window}</View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.white,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    commonText: {
        fontSize: 16,
        color: '#000000',
        paddingTop: 0,
        marginTop: 0,
        paddingLeft: 16,
        paddingRight: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
});

export default Results;
