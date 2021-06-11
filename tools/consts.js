const path = require('path');
const root = path.resolve('.');
const SOURCE_PATHS = {
    ICONS: path.resolve(root, './icons_source'),
    ILLUSTRATIONS: path.resolve(root, './illustrations_source'),
};
const DEFAULT_GENERATED_PATH = path.resolve(root, './generated');
const PUBLISH_FOLDER_PATH = path.resolve(root, './public');
// Иконки для прямого использования, без реакта
const RAW_SVGS = [
    path.resolve(SOURCE_PATHS.ICONS, './marketing/ic_mrk_mark_default_32_w.svg'),
    path.resolve(SOURCE_PATHS.ICONS, './marketing/ic_mrk_markchosen_default_48_w.svg'),
    path.resolve(SOURCE_PATHS.ICONS, './marketing/ic_mrk_markcounter_default_48_w.svg')
];

const deprecationMap = {
    ic_prd_notice_default_20_w: 'ic_prd_furthernotice_default_20_w',
    ic_srv_notice_default_20_w: 'ic_prd_furthernotice_default_20_w',
    il_scr_checkok_128_w: 'il_scrmrkt_checkok_128_w',
    il_scr_contract_128_w: 'il_scrmrkt_contract_128_w',
    il_scr_empty_128_w: 'il_scrsyst_empty_128_w',
    il_scr_encashmentmob_128_w: 'il_scrmrkt_encashmentmob_128_w',
    il_scr_error404_128_w: 'il_scrsyst_error404_128_w',
    il_scr_help_128_w: 'il_scrsyst_help_128_w',
    il_scr_like_128_w: 'il_scrmrkt_like_128_w',
    il_scr_maildocs_128_w: 'il_scrmrkt_maildocs_128_w',
    il_scr_noconnection_128_w: 'il_scrsyst_noconnection_128_w',
    il_scr_package_128_w: 'il_scrmrkt_package_128_w',
    il_scr_payments_128_w: 'il_scrmrkt_payments_128_w',
    il_scr_qr_128_w: 'il_scrmrkt_qr_128_w',
    il_scr_risk_128_w: 'il_scrmrkt_risk_128_w',
    il_scr_sberbusinessid_128_w: 'il_scrmrkt_sberbusinessid_128_w',
    il_scr_send_128_w: 'il_scrmrkt_send_128_w',
    il_scr_servicesetup_128_w: 'il_scrsyst_servicesetup_128_w',
    il_scr_state_128_w: 'il_scrmrkt_state_128_w',
    il_scr_trade_128_w: 'il_scrmrkt_trade_128_w',
};

module.exports = {
    SOURCE_PATHS: SOURCE_PATHS,
    DEFAULT_GENERATED_PATH: DEFAULT_GENERATED_PATH,
    PUBLISH_FOLDER_PATH: PUBLISH_FOLDER_PATH,
    PRIMARY_FILL_COLORS: ['#B2B8BF', '#1F1F22', '#D0D7DD'],
    SECONDARY_FILL_COLORS: ['#565B62', '#0EB757'],
    LINK_FILL_COLORS: ['#93B7ED', '#1358BF', '#0F5498', '#0EB757'],
    RAW_SVGS,
    deprecationMap,
};
