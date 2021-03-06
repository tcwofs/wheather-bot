const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard } = require('../keyboards');
const { getCurrentWheather, formatCurrentMessage, getWheatherSevenDays, formatSevenDaysMessage } = require('../wheather');

const main = new Scene('mainScene');

main.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('main')}`, getMainKeyboard(i18n)));
main.hears(['⚙️настройки', '⚙️configuration'], ({ scene }) => scene.enter('configScene'));
main.hears(['☂️forecast now', '☂️текущий прогноз'], async ({ i18n, session, replyWithHTML }) => {
  let answer = '';
  if (session.country) {
    let res = await getCurrentWheather(session.country.coord, session.units, session.__language_code);
    answer = formatCurrentMessage(res.data, session, i18n);
  } else {
    answer = i18n.t('city_null');
  }

  return replyWithHTML(answer);
});
main.hears(['📋7d forecast', '📋7д прогноз'], async ({ i18n, session, replyWithHTML }) => {
  let answer = '';
  if (session.country) {
    let res = await getWheatherSevenDays(session.country.coord, session.units, session.__language_code);
    answer = formatSevenDaysMessage(res.data, session, i18n);
  } else {
    answer = i18n.t('city_null');
  }

  return replyWithHTML(answer);
});
main.hears(['/cancel'], Stage.leave());

module.exports = {
  main,
};
