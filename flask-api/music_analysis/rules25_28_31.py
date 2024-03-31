from . import error as e
import music21
from . import music_xml_parser as mxp
from . import music21_method_extensions
WHOLE_CHORD = [True, True, True, True]
voice_names = ["Soprano", "Alto", "Tenor", "Bass"]
voice_names_lower = ["soprano", "alto", "tenor", "bass"]

def check_rules_25_28to31(chord: mxp.ChordWrapper, score: mxp.ScoreWrapper):
    music21_method_extensions.extend()

    all_errors = []

    all_errors.extend(rule29(chord, score))  # resolving V7
    all_errors.extend(rule31(chord))  # augmented melodic intervals

    return all_errors

def rule29(chord: mxp.ChordWrapper, sw): # resolving V7
    errors = []

    if (chord.rn.romanNumeralAlone == "V" and chord.chord_obj.isDominantSeventh): #V7
        if chord.next is None: # ending on V7
            ErrorParams = {
                'title': "Unresolved V7",
                'location': chord.location,
                'description': f"V7 does not resolve.",
                'suggestion': "Resolve V7 or change it to another chord.",
                'voices': [True] * 4,
                'duration': 1.0,
            }
            errors.append(e.Error(**ErrorParams))
        elif chord.next.rn.scaleDegree != 1:
            ErrorParams = {
                'title': "Unresolved V7",
                'location': chord.location,
                'description': f"V7 does not resolve to I or i.",
                'suggestion': "Resolve to I or i, or the change V7 to another chord.",
                'voices': [True] * 4,
                'duration': 2.0,
            }
            errors.append(e.Error(**ErrorParams))
        else:
            hasError = False

            suggestion = ""
            voices = [False] * 4

            lt1 = chord.degreeResolvesToByStep(7, 1, sw.key)
            lt5xs = chord.degreeResolvesTo(7, 5, sw.key) and chord.indicesOfDegree(7, sw.key)[0] != 0
            if not (lt1 or lt5xs):
                hasError = True
                for v in chord.indicesOfDegree(7, sw.key):
                    voices[v] = True
                suggestion += f"Resolve {sw.key.pitchFromDegree(7).name} to {sw.key.pitchFromDegree(1).name} by step (leading tone to tonic), or to {sw.key.pitchFromDegree(5).name} if it's not in the soprano voice.\n"

            if not chord.degreeResolvesTo(2, 1, sw.key):
                hasError = True
                for v in chord.indicesOfDegree(2, sw.key):
                    voices[v] = True
                    suggestion += f"Resolve {sw.key.pitchFromDegree(2).name} in {voice_names_lower[v]} to {sw.key.pitchFromDegree(1).name} by step (scale degree 2 to 1).\n"

            if not chord.degreeResolvesTo(4, 3, sw.key):
                hasError = True
                for v in chord.indicesOfDegree(4, sw.key):
                    voices[v] = True
                    suggestion += f"Resolve {sw.key.pitchFromDegree(4).name} in {voice_names_lower[v]} to {sw.key.pitchFromDegree(3).name} by step (scale degree 4 to 3).\n"

            if hasError:
                ErrorParams = {
                    'title': "Unresolved V7",
                    'location': chord.location,
                    'description': f"V7 is resolved improperly.",
                    'suggestion': suggestion,
                    'voices': voices,
                    'duration': 2.0,
                }
                errors.append(e.Error(**ErrorParams))

    return errors

def rule31(chord: mxp.ChordWrapper):
    errors = []

    for a in range(len(chord.melodic_intervals)):
        if chord.melodic_intervals[a].simpleName[0] == "A":
            voices = [False] * 4
            voices[a] = True
            ErrorParams = {
                'title': "Augmented Melodic Interval",
                'location': chord.location,
                'description': f"Melodic interval of augmented quality",
                'suggestion': "",
                'voices': voices,
                'duration': 2.0,
            }
            errors.append(e.Error(**ErrorParams))

    return errors

if __name__ == '__main__':
    #fn = "../music-xml-examples/voice-leading-1.musicxml"
    fn = "../music-xml-examples/rule13.musicxml"
    sw = mxp.getScoreWrapper(fn)
    curr = sw.chord_wrappers[0]
    errors = []
    while (curr is not None):
        errors.extend(check_rules_25_28to31(curr, sw))
        curr = curr.next

    for error in errors:
        print(error)