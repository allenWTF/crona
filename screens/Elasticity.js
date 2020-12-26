import React, {Component} from 'react';
import {
    ScrollView, SafeAreaView, StyleSheet, View, Text
} from 'react-native';
import {Table, TableWrapper, Row, Rows, Col} from 'react-native-table-component';
import {Colors} from "react-native/Libraries/NewAppScreen";
import Svg, {
    Rect
} from 'react-native-svg';
import Title from "../components/Title/Title";
import Button from "../components/Button/Button";
import ColorDescription from "../components/ColorDescription/ColorDescription";

class Elasticity extends Component {
    static navigationOptions = ({screenProps}) => {
        return {
            title: 'Коэффициенты эластичности'
        };
    };

    constructor(props) {
        super(props);

        this.business = props.navigation.getParam("Business", [0]);
        this.variationResults = props.navigation.getParam("VariationResults", [0]);

        this.elasticityHead = ["", "NPV", "ОДС"];
        this.elasticityTitles = [];
        this.elasticityData = [];
        this.variationResults.forEach(item => {
            this.elasticityTitles.push(item.title);
            this.elasticityData.push(this.business.CalculatePrjectEvaluationElasticity(item.param));
        });

    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic"
                            contentContainerStyle={styles.contentContainer}
                            ref={ref => this.scrollView = ref}
                            onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                            style={styles.scrollView}>

                    <View style={{paddingBottom: 10, paddingTop: 10}}>
                        <Title>Матрица коэффициентов эластичности</Title>
                    </View>
                    <Text maxFontSizeMultiplier={1} style={styles.commonText}>
                        Матрица коэффициентов эластичности позволяет провести идентификацию рисков Вашего
                        инвестеционного
                        проекта. Коэффициенты
                        эластичности определяют не только сами источники риска, но и степень их воздействия на основные
                        выходные показатели (чистая текущая стоимость и остаток денежных средств).
                    </Text>
                    <View style={styles.container}>
                        <Table borderStyle={{borderWidth: 2}}>
                            <Row data={this.elasticityHead} flexArr={[3, 1, 1]} style={styles.head}
                                 textStyle={styles.text}/>
                            <TableWrapper style={styles.wrapper}>
                                <Col data={this.elasticityTitles} style={styles.title} heightArr={[50, 50, 50, 50, 50]}
                                     textStyle={styles.text}/>
                                <Rows data={this.elasticityData} flexArr={[1, 1]} style={styles.row}
                                      textStyle={styles.text}/>
                            </TableWrapper>
                        </Table>
                    </View>
                    <View style={styles.infoBlock}>
                        <ColorDescription text="Риск воздействия можно считать не существенным" colorObject=<Svg
                                          width={"32"} height={"32"}>
                            <Rect
                                width="32"
                                height="32"
                                fill="#28a745"
                            />
                        </Svg>/>
                        <ColorDescription text="Степень риска средняя" colorObject=<Svg width={"32"} height={"32"}>
                            <Rect
                                width="32"
                                height="32"
                                fill="#ffc107"
                            />
                        </Svg>/>
                        <ColorDescription text="Риск весьма большой, и необходимо принятие адекватных мер"
                                          colorObject=<Svg width={"32"} height={"32"}>
                            <Rect
                                width="32"
                                height="32"
                                fill="#dc3545"
                            />
                        </Svg>/>
                    </View>
                    <Button title={"Изменить входные параметры"}
                            key={Math.random() * 100000} onPress={() => {
                        this.props.navigation.navigate("Home")
                    }}></Button>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.white,
    },
    commonText: {
        fontSize: 16,
        color: '#000000',
        paddingTop: 0,
        marginTop: 0,
        paddingLeft: 16,
        paddingRight: 16,
    },
    container: {flex: 1, padding: 16, paddingTop: 20, backgroundColor: '#fff'},
    head: {height: 65, backgroundColor: '#f1f8ff'},
    wrapper: {flexDirection: 'row'},
    title: {flex: 2.95, backgroundColor: '#f6f8fa'},
    row: {height: 50},
    text: {textAlign: 'center', margin: 10},
    contentContainer: {
        paddingBottom: 20,
    },
    infoBlock: {
        marginHorizontal: 6
    }
});

export default Elasticity;