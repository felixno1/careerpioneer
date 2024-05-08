import configparser

config = configparser.ConfigParser()
config.read('config.txt')

class Data:
    ENABLE = config.getboolean('Settings', 'COLLECT_DATA')
    WORKBOOK = config.get('Settings', 'WORKBOOK_NAME')