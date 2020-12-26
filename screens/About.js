import React, {Component} from 'react';

import {
    SafeAreaView, ScrollView, StyleSheet, Text,
} from 'react-native';
import Title from '../components/Title/Title';


class About extends Component {

    static navigationOptions = ({screenProps}) => {
        return {
            title: 'О приложении',
        };
    };

    render() {
        return (
            <SafeAreaView>
                <ScrollView
                    style={styles.scrollView}
                    contentInsetAdjustmentBehavior="automatic">
                    <Text maxFontSizeMultiplier={1} style={styles.commonText}>Данное приложение поможет Вам быстро и
                        просто составить и оценить финансовый раздел бизнес-плана Вашего будущего предприятия. </Text>
                    <Title>Как пользоваться приложением?</Title>
                    <Text maxFontSizeMultiplier={1} style={styles.commonText}>
                        Заполните все поля на главном экране, затем нажмите кнопку "Рассчитать финансовый план". Вы
                        будете перенаправлены
                        на экран результатов. На этом окране представлены результаты оценки финансовой эффективности
                        вашего проекта. Далее,
                        на этом экране нажмите на кнопку "Перейти к методу вариации параметров", чтобы оценить
                        устойчивость вашего проекта
                        к различным рискам. Наконец, при нажатии на этом экране на кнопку "Перейти к коэффициентам
                        эластичности", Вы сможете
                        узнать меру опасности каждого риска.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    commonText: {
        fontSize: 16,
        color: '#000000',
        paddingTop: 0,
        marginTop: 0,
        paddingLeft: 16,
        paddingRight: 16,
    },
});

export default About;
