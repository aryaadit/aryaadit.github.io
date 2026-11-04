import sys, csv, glob, os, string, re
import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

def parse_args(argv):
    force_parse = False
    if len(argv) < 2:
        sys.exit('usage: python main.py N')
    elif len(argv) > 2 and argv[2] == '--parse':
        force_parse = True
    pdf_filenames = glob.glob('./resumes/*')

    if not os.path.isdir('./text_resumes'):
        os.system('mkdir ./text_resumes')

    for pdf_filename in pdf_filenames:
        text_filename = './text_resumes/' + os.path.basename(pdf_filename).split('.')[0] + '.txt'
        if force_parse or not os.path.isfile(text_filename):
            print 'parsing ' + pdf_filename + '...'
            os.system('python pdf2txt.py "' + pdf_filename + '" > "' + text_filename + '"')

def get_stopwords():
    additional_stopwords = open('additional_stopwords')
    return set(stopwords.words('english')
               + list(string.punctuation)
               + word_tokenize(additional_stopwords.read().decode('utf-8')))

# def extract_key_phrases(data):
#     f = open('key_phrases')
#     key_phrases.read().split()
#
#     for phrase in key_phrases:
#

def get_states():
    states = {
        'AK': 'Alaska',
        'AL': 'Alabama',
        'AR': 'Arkansas',
        'AS': 'American Samoa',
        'AZ': 'Arizona',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DC': 'District of Columbia',
        'DE': 'Delaware',
        'FL': 'Florida',
        'GA': 'Georgia',
        'GU': 'Guam',
        'HI': 'Hawaii',
        'IA': 'Iowa',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'MA': 'Massachusetts',
        'MD': 'Maryland',
        'ME': 'Maine',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MO': 'Missouri',
        'MP': 'Northern Mariana Islands',
        'MS': 'Mississippi',
        'MT': 'Montana',
        'NA': 'National',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'NE': 'Nebraska',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NV': 'Nevada',
        'NY': 'New York',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'OR': 'Oregon',
        'PA': 'Pennsylvania',
        'PR': 'Puerto Rico',
        'RI': 'Rhode Island',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VA': 'Virginia',
        'VI': 'Virgin Islands',
        'VT': 'Vermont',
        'WA': 'Washington',
        'WI': 'Wisconsin',
        'WV': 'West Virginia',
        'WY': 'Wyoming'
    }
    return states

def initialize_schools():
    school_names = open('schools_small').read().decode('utf-8').split('\n')
    school_names = filter(None, school_names)
    schools = {}
    for name in school_names:
        schools[name] = 0
    return schools

def initialize_plang_freqs():
    plang_names = open('programming_languages').read().decode('utf-8').split()
    plangs = {}
    for name in plang_names:
        plangs[name] = 0
    return plangs

def extract_locations(data, locs):
    states = get_states()

    for abbr in states.keys():
        data = re.sub(' ' + abbr, ' ' + states[abbr], data)

    for state in states.values():
        count = data.lower().count(state.lower())
        # data = re.sub(state.lower(), '', data, flags=re.IGNORECASE).strip()
        locs[state] += count

    return data

def extract_plangs(data, plangs):

    for plang in plangs.keys():
        if plang == 'C':
            count = len(re.findall(r"(?<!objective-)\bC\b(?=[^+#])", data))
        elif plang == 'R':
            count = len(re.findall(r"\bR\b", data))
        else:
            count = data.lower().count(plang.lower())
            # data = re.sub(re.escape(plang.lower()), '', data, flags=re.IGNORECASE).strip()
        plangs[plang] += count

    return data

def extract_schools(data, schools):

    for school in schools.keys():
        count = data.lower().count(school.lower())
        # data = re.sub(re.escape(school.lower()), '', data, flags=re.IGNORECASE).strip()
        schools[school] += count

    return data

def extract_gpas(data, gpas):
    gpas += re.findall(r"GPA-?:?\s?([0-4]\.\d\d?)", data)

def initialize_locs():
    states = get_states()
    locs = {}

    for state in states.values():
        locs[state] = 0

    return locs

# usage: python main.py N [--parse]
# output: csv file with words with top N frequency
def main(argv):
    parse_args(argv)

    freq = {}
    locs = initialize_locs()
    plang_freq = initialize_plang_freqs()
    schools = initialize_schools()
    gpas = []

    stop = get_stopwords()

    text_filenames = glob.glob('./text_resumes/*')

    for filename in text_filenames:
        f = open(filename)
        data = f.read().decode('utf-8')
        data = extract_locations(data, locs)
        data = extract_plangs(data, plang_freq)
        data = extract_schools(data, schools)
        extract_gpas(data, gpas)

        words = word_tokenize(data)
        words = [x for x in words if not x.isdigit()]

        for word in words:
            if word in freq:
                freq[word] += 1
            else:
                if word not in stop:
                    freq[word] = 1
        f.close()

    with open('word_freq.csv', 'wb') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['word', 'frequency'])
        for key, value in freq.items():
           writer.writerow([key.encode('utf-8'), value])

    with open('locs_freq.csv', 'wb') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['state', 'frequency'])
        for key, value in locs.items():
           writer.writerow([key.encode('utf-8'), value])

    with open('plang_freq.csv', 'wb') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['programming_language', 'frequency'])
        for key, value in plang_freq.items():
           writer.writerow([key.encode('utf-8'), value])

    with open('schools.csv', 'wb') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(['school', 'frequency'])
        for key, value in schools.items():
           writer.writerow([key.encode('utf-8'), value])

    gpas = [float(i) for i in gpas]

    with open('gpas.csv', 'wb') as csv_file:
        wr = csv.writer(csv_file)
        wr.writerow(gpas)

    df = pd.read_csv('word_freq.csv')
    df = df.sort_values('frequency', ascending=False)
    df = df.head(int(argv[1]))
    df.to_csv('word_freq.csv', index=False)

if __name__ == '__main__': sys.exit(main(sys.argv))
