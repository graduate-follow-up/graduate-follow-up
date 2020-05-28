from time import sleep
from urllib.parse import unquote
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from flask import Flask
from flask import request
import json

app = Flask(__name__)

def login(username, password):

    # Connection au compte linkedin
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome('/usr/lib/chromium/chromedriver', options=chrome_options)
    driver.get('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin')
    username_elt = driver.find_element_by_name('session_key')
    username_elt.send_keys(username)
    sleep(0.5)
    password_elt = driver.find_element_by_name('session_password')
    password_elt.send_keys(password)
    sleep(0.5)
    sign_in_button = driver.find_element_by_class_name('login__form_action_container ')
    sign_in_button.click()
    sleep(0.5)
    return driver

def logout(driver):
    driver.get('https://www.linkedin.com/m/logout')

def get_profile(name, surname, driver):

    alumni = name + " " + surname
    # Searching alumni profile in search bar
    search_bar = driver.find_element_by_xpath('//*[@class = "search-global-typeahead__input always-show-placeholder"]')
    search_bar.send_keys(alumni)
    sleep(0.5)
    search_bar.send_keys(Keys.RETURN)
    sleep(2)
    list_profiles = driver.find_elements_by_class_name("search-result__wrapper")
    profile_found = False
    res = "Pas d'information trouvée."
    # In search results, look for the first
    try:
        i = 0
        while not profile_found and (i < len(list_profiles)):
            print("boucle")
            useless = list_profiles[i].find_element_by_xpath('.//div[@class="search-result__image-wrapper"]')
            usefull = useless.find_element_by_xpath('./following-sibling::div')
            link_tmp = usefull.find_element_by_xpath('./following::a')
            link_tmp = link_tmp.get_attribute('href')
            name_surname = "{0}-{1}".format(name, surname)
            surname_name = "{0}-{1}".format(surname, name)
            if name_surname.lower() in link_tmp or surname_name.lower() in link_tmp:
                profile_found = True
                profile = link_tmp
            i += 1
    except NoSuchElementException:
        pass

    if profile_found:
        driver.get(profile)
        sleep(2)

        try:
            exp_section = driver.find_element_by_id('experience-section')
            list_exp_elt = exp_section.find_element_by_tag_name('ul')
            found = True
        except NoSuchElementException:
            res = "Pas d'experience trouvée."
            found = False


        if found:
            res = []
            # For each experience
            for il in list_exp_elt.find_elements_by_tag_name('li'):
                dict_experience = None
                try:
                    poste = il.find_element_by_xpath('.//h3[@class = "t-16 t-black t-bold"]').text
                except NoSuchElementException:
                    poste = "Poste inconnu."

                try:
                    entreprise = il.find_element_by_xpath('.//p[@class = "pv-entity__secondary-title t-14 t-black t-normal"]').text
                except NoSuchElementException:
                    entreprise = "Entreprise inconnue."

                try:
                    periode = il.find_element_by_xpath('.//h4[@class = "pv-entity__date-range t-14 t-black--light t-normal"]/span[2]').text
                except NoSuchElementException:
                    periode = "Periode inconnue."

                try:
                    location = il.find_element_by_xpath('.//h4[@class = "pv-entity__location t-14 t-black--light t-normal block"]/span[2]').text
                except NoSuchElementException:
                    location = "Localisation inconnue."

                dict_experience =  {
                        "poste": poste,
                        "entreprise": entreprise,
                        "periode": periode,
                        "localisation": location
                        }
                res.append(dict_experience)
            return res
    return res


@app.route("/<param>", methods = ["GET"])
def main(param):
    alumni = unquote(param)
    driver = login('linkedin.projetentreprise2@gmail.com', 'projetentreprise123*')
    try:
        search_bar = driver.find_element_by_xpath('//*[@class = "search-global-typeahead__input always-show-placeholder"]')
        found = True
    except NoSuchElementException:
        found = False

    if found:
        alumni_name = alumni.split(" ")[0]
        surnames = alumni.split(" ")[1:]
        alumni_surname = " ".join(surnames)
        print(alumni_name)
        print(alumni_surname)
        exp = get_profile(alumni_name, alumni_surname, driver)
        logout(driver)
        driver.quit()
        return(json.dumps(exp, sort_keys=True, indent=4, ensure_ascii=False))
    else:
        return(json.dumps({'error': 'Captcha error.'} , sort_keys=True, indent=4, ensure_ascii=False))


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=80)
