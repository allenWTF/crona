import React, {Component} from 'react';
import {
    SafeAreaView, ScrollView, StyleSheet, Text, View
} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import Title from "../components/Title/Title";
import LineChart from "react-native-responsive-linechart";
import {Picker} from '@react-native-community/picker';
import ResultTable from "../components/ResultTable/ResultTable"
import Button from "../components/Button/Button";
import ModalWindow from "../components/ModalWindow/ModalWindow";

class Variation extends Component {

    static navigationOptions = ({screenProps}) => {
        return {
            title: 'Вариация параметров'
        };
    };

    constructor(props) {
        super(props);

        this.business = props.navigation.getParam("Business", [0]);
        this.results = [
            {
                title: "🔻 Проданные изделия в год на " +
                    Math.abs((100 - this.business.variationChanges.find(item => item.value === "NumberOfServicesSoldPerYear").amount * 100)) + "%",
                param: "NumberOfServicesSoldPerYear",
                data: this.business.UpdateWithVariation("NumberOfServicesSoldPerYear")
            },
            {
                title: "🔻 Цена продажи за единицу на " +
                    Math.abs((100 - this.business.variationChanges.find(item => item.value === "UnitSalesPrice").amount * 100)) + "%",
                param: "UnitSalesPrice",
                data: this.business.UpdateWithVariation("UnitSalesPrice")
            },
            {
                title: "🔺 Цена материала за единицу на " +
                    Math.abs((100 - this.business.variationChanges.find(item => item.value === "UnitPrice").amount * 100)) + "%",
                param: "UnitPrice",
                data: this.business.UpdateWithVariation("UnitPrice")
            },
            {
                title: "🔻 Оборачиваемость деб. задолженности на " +
                    Math.abs((100 - this.business.variationChanges.find(item => item.value === "Receivables").amount * 100)) + "%",
                param: "Receivables",
                data: this.business.UpdateWithVariation("Receivables")
            },
            {
                title: "🔺 Стоимость кредита на " +
                    Math.abs((100 - this.business.variationChanges.find(item => item.value === "LoanCost").amount * 100)) + "%",
                param: "LoanCost",
                data: this.business.UpdateWithVariation("LoanCost")
            }
        ];
        this.resultPickers = (() => {
            let obj = [];
            this.results.forEach(item => {
                obj.push(<Picker.Item label={item.title} value={item.title} key={item.title}/>);
            });
            return obj;
        })();

        this.state = {
            currentParam: this.results[0].title,
            modal: {
                isON: false,
                window: null
            }
        };

        this.GoToEllasticMatrix = this.GoToEllasticMatrix.bind(this);
    }

    GoToEllasticMatrix(force) {
        let badReasons = this.CheckProject();

        if (badReasons.length > 0 && force === false) {
            this.setState({
                modal: {
                    ...this.state.modal,
                    window: <ModalWindow header={"Инвестиционный проект неустойчив"}
                                         description={"Ваш инвестеционной проект оказался неустойчив к вариации некоторых параметров"}
                                         data={badReasons}
                                         buttons={[<Button title={"Изменить входные параметры"}
                                                           key={Math.random() * 100000} onPress={() => {
                                             this.props.navigation.navigate("Home")
                                         }}></Button>,
                                             <Button title={"Вернуться к результатам"}
                                                     key={Math.random() * 100000} onPress={() => {
                                                 this.setState({modal: {...this.state.modal, isON: false}})
                                             }}></Button>,
                                             <Button key={Math.random() * 100000} title={"Всё равно продолжить"}
                                                     bgColor={"grey"} onPress={() => {
                                                 this.GoToEllasticMatrix(true)
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
                this.props.navigation.navigate("Elasticity", {Business: this.business, VariationResults: this.results})
            })
        }
    }

    CheckProject() {
        let reasons = [];

        this.results.forEach(item => {
            if (item.data.CurrentNPV[item.data.CurrentNPV.length - 1] < 0) {
                reasons.push("Отрицательная чистая текущая стоимость при ситуации \n" + item.title)
            }
            if (item.data.CashBalance.some(cashBalanceItem => cashBalanceItem < 0)) {
                reasons.push("Отрицательный остаток денежных средств при ситуации \n" + item.title)
            }
        });

        if (reasons.length > 0) {
            reasons.forEach((item) => {
                reasons.push({key: item});
            });
            reasons.splice(0, reasons.length / 2);
        }

        return reasons;
    }

    render() {

        const currentResult = this.results.find(item => item.title === this.state.currentParam);

        let gridStep = 100;
        if (currentResult.data.CurrentNPV[1]) {
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 1000) {
                gridStep = 10000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 10000) {
                gridStep = 50000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 50000) {
                gridStep = 100000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 100000) {
                gridStep = 500000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 500000) {
                gridStep = 1000000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 1000000) {
                gridStep = 10000000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 10000000) {
                gridStep = 100000000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 100000000) {
                gridStep = 1000000000;
            }
            if (Math.abs(currentResult.data.CurrentNPV[2] - currentResult.data.CurrentNPV[1]) > 1000000000) {
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
                        <Title>Метод вариации параметров</Title>
                    </View>
                    <Text maxFontSizeMultiplier={1} style={styles.commonText}>
                        С помощью метода вариации параметров, было произведено измерение рисков Вашего инвестеционного
                        проекта. Здесь вы можете оценить, как
                        изменяются два основных выходных показателя проекта (чистая текущая стоимость и остаток денежных
                        средств) при неблагоприятном изменении
                        некоторых входных параметров.
                    </Text>
                    <Picker style={styles.picker} mode={"dropdown"} selectedValue={this.state.currentParam}
                            onValueChange={(itemValue, itemIndex) => this.setState({currentParam: itemValue})}>
                        {this.resultPickers}
                    </Picker>
                    <View style={{marginTop: 20}}>
                        <Title>Финансовый профиль проекта</Title>
                        <View style={{height: 240}}>
                            <LineChart style={{flex: 1}} xLabels={[0, 1, 2, 3, 4, 5, 6]} config={config}
                                       data={currentResult.data.CurrentNPV}/>
                        </View>
                        <ResultTable data={currentResult.data.CurrentNPV}/>
                    </View>
                    <View style={{marginTop: 20}}>
                        <Title>Динамика остатка денежных средств</Title>
                        <View style={{height: 240}}>
                            <LineChart style={{flex: 1}} xLabels={[0, 1, 2, 3, 4, 5, 6]} config={config}
                                       data={currentResult.data.CashBalance}/>
                        </View>
                        <ResultTable data={currentResult.data.CashBalance}/>
                    </View>
                    <Button title={"Перейти к коэффициентам элластичности"} onPress={() => {
                        this.GoToEllasticMatrix(false)
                    }}></Button>
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
    picker: {
        marginTop: 10,
        marginHorizontal: 6
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
});

export default Variation