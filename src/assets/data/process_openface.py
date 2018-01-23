
from collections import defaultdict
import csv
import json
import numpy as np
import os
import sys
import pandas as pd


def write_metrics_to_JSON(patient_id, patient_file, patient_summary):
    """
    Takes in list of metrics and writes JSON file to patient's data directory
    """
    patient_uuid = os.path.basename(patient_file).split('.')[0]
    patient_directory = os.path.dirname(patient_file)
    patient_json_file = '%s_%s_%s.json' % (patient_id, 'visual', 'summary')
    patient_json_output = os.path.join(patient_directory, patient_json_file)

    with open(patient_json_output, 'w') as write_to_this_file:
        json.dump(patient_summary, write_to_this_file)
    return

def generate_means(openface_output):
    """
    Generates means for important features for comparisons

    brow_lower_expressivity
    brow_raise_expressivity
    overall_expressivity
    smile_intensity
    smile_length
    """

    patient_means_outfile = 'means.json'
    patient_means = defaultdict(float);
    total_data_points = 0

    for root, dirs, files in os.walk(openface_output):
        for f in files:

            if f.endswith('.json'):
                f = open(os.path.join(root, f))
                patient_data = json.load(f)
                for visit_date in patient_data:
                    total_data_points += 1
                    data_at_date = patient_data[visit_date]

                    for feature in data_at_date:
                        patient_means[feature] += data_at_date[feature]



    for feature in patient_means:
        patient_means[feature] = patient_means[feature] / total_data_points

    with open(patient_means_outfile, 'w') as write_to_this_file:
        json.dump(patient_means, write_to_this_file)

    return

def generate_dynamic_metrics_from_raw_output():
    """
    Generates time series of following features:
        1. Smile intensity
        2. Eye activity
        3. Brow activity
    """
    return

def calculate_overall_expressivity(patient_data):
    """
    Helper function to calculate overall expressivity of patient
    """
    expressivity = 0

    for feature in patient_data:
        expressivity += patient_data[feature].mean()

    print 'OVERALL EXPRESSIVITY:', expressivity
    return expressivity

def calculate_smile_expressivity(patient_data):
    """
    Helper function to calculate overall expressivity of patient
    We focus on AU12
    """
    print 'SMILE EXPRESSIVITY:', patient_data[' AU12_r'].mean()
    return patient_data[' AU12_r'].mean()

def calculate_smile_length(patient_data):
    """
    Calculates the average length of a smile (AU12 > 1)
    """

    smiles = list(patient_data[' AU12_r'])

    smile_lengths = []

    smile_length = 0
    for smile in smiles:
        if smile >= 1.0:
            smile_length += 1
        if smile < 1.0 and smile_length > 0:
            smile_lengths.append(smile_length)
            smile_length = 0

    print 'SMILE LENGTHS', smile_lengths
    print 'AVERAGE SMILE LENGTH:', np.mean(smile_lengths)
    return np.mean(smile_lengths)

def calculate_brow_expressivity(patient_data):
    """
    Helper function to calculate overall expressivity of patient
    Based on results from https://www.cl.cam.ac.uk/~tb346/pub/papers/cmhw2016.pdf,
    we focus on AU2 (brow raiser) and AU4 (brow furrowing)
    """
    return dict(
        raiser=patient_data[' AU02_r'].mean(),
        lower=patient_data[' AU04_r'].mean()
    )

def get_openface_output(patient_id):
    """
    Helper function to format filepath to patient's openface output directory and
    return all openface outputs
    :param patient_id:
    :return patient_openface_path:
    """

    patient_directory = os.path.join(os.path.abspath(os.path.join(os.getcwd(), 'openface')), patient_id)
    patient_openface_outputs = []
    for root, dirs, files in os.walk(patient_directory):
        for f in files:
            if f.endswith('.txt'):
                patient_openface_outputs.append(os.path.join(patient_directory, f))

    return patient_openface_outputs

def generate_summary_metrics_from_raw_output(patient_id):
    """
    This function takes the raw output from Openface and outputs the following
    summary metrics (NOTE: this list is not final and will be edited):
        1. Expressivity
        2. Smile Expressivity
        3. Brow Raising Expressivity
        4. Brow Lowering Expressivity
        5. Eye Expressivity
        6. Average smile length
        7. Average smile intensity

    :param patient_id: string representing patient to generate metrics for. function goes to this patient's
                       data folder to get raw openface output
    :return patient_metrics: object containing summary metrics to be serialized to JSON/CSV
    """


    patient_openface_outputs = get_openface_output(patient_id)
    patient_summary = defaultdict(dict)

    for patient_output in patient_openface_outputs:

        patient_visit_date = os.path.basename(patient_output)[:6]   # slightly hacky, but we assume a format of YYMMDD and use this as the index

        patient_data_frame = pd.read_csv(patient_output)
        action_units = [feature for feature in list(patient_data_frame.columns.values) if '_r' in feature] # also a hacky way to get action unit features
        high_confidence = patient_data_frame[' confidence'] > 0.7
        patient_data_frame = patient_data_frame[action_units]   # only want action units features
        patient_data_frame = patient_data_frame[high_confidence]

        patient_summary[patient_visit_date]['overall_expressivity'] = calculate_overall_expressivity(patient_data_frame)

        patient_summary[patient_visit_date]['smile_length'] = calculate_smile_length(patient_data_frame)
        patient_summary[patient_visit_date]['smile_intensity'] = calculate_smile_expressivity(patient_data_frame)

        patient_summary[patient_visit_date]['brow_raise_expressivity'] = calculate_brow_expressivity(patient_data_frame)['raiser']
        patient_summary[patient_visit_date]['brow_lower_expressivity'] = calculate_brow_expressivity(patient_data_frame)['lower']

        write_metrics_to_JSON(patient_id, patient_output, patient_summary) # write JSON blob to patient directory
    return


def main(args):
    openface_output = os.path.abspath(os.path.join(os.getcwd(), 'openface'))
    #generate_summary_metrics_from_raw_output(args[1])
    generate_means(openface_output)
    return


if __name__=='__main__':
    sys.exit(main(sys.argv))
