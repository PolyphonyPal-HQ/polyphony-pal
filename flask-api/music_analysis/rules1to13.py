from . import error as e
import music21
from . import music_xml_parser as mxp
from . import music21_method_extensions
WHOLE_CHORD = [True, True, True, True]
voice_names = ["Soprano", "Alto", "Tenor", "Bass"]
voice_names_lower = ["soprano", "alto", "tenor", "bass"]


# Parse chorddatas and check rules
def check_rules_1_to_13(chord: mxp.ChordWrapper, score: mxp.ScoreWrapper):
    music21_method_extensions.extend()

    all_errors = []

    all_errors.extend(rule1(chord)) # curr, range
    all_errors.extend(rule2(chord)) # curr, spacing
    all_errors.extend(rule3(chord)) # curr, voice crossing
    all_errors.extend(rule4(chord)) # curr, next, voice overlapping
    all_errors.extend(rule5(chord)) # curr, next, large melodic leaps
    all_errors.extend(rule6(chord)) # curr, next, nextnext, double melodic leaps
    all_errors.extend(rule7(chord)) # curr, next, nextnext, resolving leaps
    all_errors.extend(rule8(chord)) # curr, next, nextnext, resolving diminished movement
    all_errors.extend(rule9(chord)) # curr, next, resolving the seventh of a chord
    all_errors.extend(rule10(chord)) # curr, non-chords
    all_errors.extend(rule11(chord)) # curr, next, parallel octaves
    all_errors.extend(rule12(chord)) # curr, next, parallel fifths
    all_errors.extend(rule13(chord)) # curr, next, hidden fifths and octaves

    return all_errors

def rule1(chord: mxp.ChordWrapper): # range
    errors = []
    ranges = [
        ('C4', 'G5'),  # soprano
        ('G3', 'C5'),  # alto
        ('C3', 'G4'),  # tenor
        ('E2', 'C4')  # bass
    ]
    for i in range(len(chord.notes)):
        n = chord.notes[i]
        if n.higherThan(music21.note.Note(ranges[i][1])) or n.lessThan(music21.note.Note(ranges[i][0])):
            low, high = ranges[i]
            voices = [False] * 4
            voices[i] = True
            ErrorParams = {
                'title': "Range Error",
                'location': chord.location,
                'description': f"{n.pitch} in {voice_names_lower[i]} is out of range.",
                'suggestion': f"Write voice in range [{low}, {high}].",
                'voices': voices,
                'duration': 1.0,
                'link': "https://musictheory.pugetsound.edu/mt21c/VoiceRanges.html"
            }
            errors.append(e.Error(**ErrorParams))

    return errors

def rule2(chord: mxp.ChordWrapper): # spacing
    errors = []

    s_a = chord.harmonic_intervals[(0, 1)]
    a_t = chord.harmonic_intervals[(1, 2)]

    title = "Spacing Error"
    link = "https://musictheory.pugetsound.edu/mt21c/RulesOfSpacing.html"

    if abs(s_a.semitones) > 12:
        ErrorParams = {
            'title': title,
            'location': chord.location,
            'description': f"{chord.notes[0].pitch} and {chord.notes[1].pitch} in soprano and alto voices are wider than P8.",
            'suggestion': "Lower the soprano voice or raise the alto voice.",
            'voices': [True, True, False, False],
            'duration': 1.0,
            'link': link
        }
        errors.append(e.Error(**ErrorParams))

    if abs(a_t.semitones) > 12:
        ErrorParams = {
            'title': title,
            'location': chord.location,
            'description': f"{chord.notes[1].pitch} and {chord.notes[2].pitch} in alto and tenor voices are wider than P8.",
            'suggestion': "Lower the alto voice or raise the tenor voice.",
            'voices': [False, True, True, False],
            'duration': 1.0,
            'link': link
        }
        errors.append(e.Error(**ErrorParams))

    return errors

def rule3(chord: mxp.ChordWrapper): # voice crossing
    errors = []

    for a in range(len(chord.notes)-1):
        for b in range(a, len(chord.notes)):
            if chord.notes[b].higherThan(chord.notes[a]):
                voices = [False] * 4
                voices[a] = True
                voices[b] = True
                ErrorParams = {
                    'title': "Voice Crossing",
                    'location': chord.location,
                    'description': f"{voice_names[b]} voice is above {voice_names_lower[a]} voice.",
                    'suggestion': "Move or switch voices.",
                    'voices': voices,
                    'duration': 1.0,
                    'link': "https://kaitlinbove.com/voice-leading"
                }
                errors.append(e.Error(**ErrorParams))

    return errors

def rule4(chord: mxp.ChordWrapper): # overlapping
    errors = []

    title = "Voice Overlapping"
    link = "https://kaitlinbove.com/voice-leading"

    for a in range(len(chord.notes)-1):
        if (chord.next is not None and chord.notes[a].lessThan(chord.next.notes[a + 1])):
            voices = [False] * 4
            voices[a] = True
            voices[a+1] = True
            ErrorParams = {
                'title': title,
                'location': chord.location,
                'description': f"{voice_names[a+1]} crosses above the {voice_names_lower[a]} voice.",
                'suggestion': "",
                'voices': voices,
                'duration': 2.0,
                'link': link
            }
            errors.append(e.Error(**ErrorParams))

    for b in range(1, len(chord.notes)):
        if (chord.next is not None and chord.notes[b].higherThan(chord.next.notes[b - 1])):
            voices = [False] * 4
            voices[a] = True
            voices[a+1] = True
            ErrorParams = {
                'title': title,
                'location': chord.location,
                'description': f"{voice_names[b-1]} crosses below the {voice_names_lower[b]} voice.",
                'suggestion': "",
                'voices': voices,
                'duration': 2.0,
                'link': link
            }
            errors.append(e.Error(**ErrorParams))

    return errors

def rule5(chord: mxp.ChordWrapper): # melodic leaps
    errors = []

    for a in range(len(chord.melodic_intervals)):
        if abs(chord.melodic_intervals[a].semitones) > 12:
            voices = [False] * 4
            voices[a] = True
            ErrorParams = {
                'title': "Large Melodic Leap",
                'location': chord.location,
                'description': f"{voice_names[a]} leaps an interval greater than P8.",
                'suggestion': "Change octaves or decrease the leap.",
                'voices': voices,
                'duration': 2.0,
                'link': "https://kaitlinbove.com/voice-leading"
            }
            errors.append(e.Error(**ErrorParams))

    return errors

def rule6(chord: mxp.ChordWrapper): # double leaps
    errors = []

    for a in range(len(chord.melodic_intervals)):
        if (int(chord.melodic_intervals[a].name[1]) > 2 and chord.next is not None and chord.next.next is not None): # leaps and two more chords
            next_chord_leaps = (int(chord.next.melodic_intervals[a].name[1]) > 2)
            same_direction = (chord.melodic_intervals[a].direction == chord.next.melodic_intervals[a].direction)
            if (next_chord_leaps and same_direction):
                melodic_chord = music21.chord.Chord([chord.notes[a], chord.next.notes[a], chord.next.next.notes[a]])
                if (not (melodic_chord.isMajorTriad() or melodic_chord.isMinorTriad())):
                    voices = [False] * 4
                    voices[a] = True
                    ErrorParams = {
                        'title': "Double Melodic Leap not a Triad",
                        'location': chord.location,
                        'description': f"{voice_names[a]} leaps twice not outlining a triad.",
                        'suggestion': "Change a leap to a step.",
                        'voices': voices,
                        'duration': 3.0,
                        'link': "https://musictheory.pugetsound.edu/mt21c/RulesOfMelody.html"
                    }
                    errors.append(e.Error(**ErrorParams))

    return errors

def rule7(chord: mxp.ChordWrapper): # resolving leaps
    errors = []

    for a in range(len(chord.melodic_intervals)):
        i = chord.melodic_intervals[a]
        if (int(i.name[1]) > 4 and chord.next is not None and chord.next.next is not None):
            i2 = chord.next.melodic_intervals[a]
            if (not (i2.isStep and i.diatonic.direction != i2.diatonic.direction)):
                voices = [False] * 4
                voices[a] = True
                ErrorParams = {
                    'title': "Improperly Resolved Leap",
                    'location': chord.location,
                    'description': f"{voice_names[a]} leaps greater than P4 without resolve.",
                    'suggestion': "Resolve stepwise in the opposite direction.",
                    'voices': voices,
                    'duration': 3.0,
                    'link': "https://musictheory.pugetsound.edu/mt21c/RulesOfMelody.html"
                }
                errors.append(e.Error(**ErrorParams))

    return errors

def rule8(chord: mxp.ChordWrapper): # resolving diminished movement
    errors = []

    for a in range(len(chord.melodic_intervals)):
        i = chord.melodic_intervals[a]
        if (i.name[0] == 'd' and chord.next is not None and chord.next.next is not None):
            i2 = chord.next.melodic_intervals[a]
            if (not (i2.isStep and i.diatonic.direction != i2.diatonic.direction)):
                voices = [False] * 4
                voices[a] = True
                ErrorParams = {
                    'title': "Improperly Resolved Leap",
                    'location': chord.location,
                    'description': f"{voice_names[a]} moves by diminished interval without resolving.",
                    'suggestion': "Resolve stepwise in the opposite direction.",
                    'voices': voices,
                    'duration': 3.0,
                    'link': "https://musictheory.pugetsound.edu/mt21c/RulesOfMelody.html"
                }
                errors.append(e.Error(**ErrorParams))

    return errors

def rule9(chord: mxp.ChordWrapper): # resolving the 7th
    errors = []

    for a in range(len(chord.notes)):
        if (chord.notes[a].pitch == chord.chord_obj.seventh): # note is seventh of chord
            if (chord.next is None or # can't end on a 7th chord
                not (chord.melodic_intervals[a].isStep and chord.melodic_intervals[a].direction.value == -1)):
                voices = [False] * 4
                voices[a] = True
                ErrorParams = {
                    'title': "Unresolved Seventh",
                    'location': chord.location,
                    'description': f"Seventh of chord in {voice_names_lower[a]} ({chord.notes[a].pitch}) does not resolve stepwise down.",
                    'suggestion': "Resolve the seventh of a chord stepwise down.",
                    'voices': voices,
                    'duration': 2.0,
                    'link': "https://musictheory.pugetsound.edu/mt21c/VoiceLeadingSeventhChordsIntro.html"
                }
                errors.append(e.Error(**ErrorParams))

    return errors

# test for augented sixth chords
def rule10(chord: mxp.ChordWrapper): # valid chords
    errors = []

    co = chord.chord_obj
    if (not (co.isTriad() or co.isSeventh())):
        voices = [True] * 4
        ErrorParams = {
            'title': "Impermissable Chord Type",
            'location': chord.location,
            'description': f"Voices do not form a triad or seventh chord.",
            'suggestion': "Rewrite as a seventh chord or triad.",
            'voices': voices,
            'duration': 1.0,
            'link': "https://musictheory.pugetsound.edu/mt21c/RomanNumeralChordSymbols.html"
        }
        errors.append(e.Error(**ErrorParams))

    return errors

# test parallel unison as well
def rule11(chord: mxp.ChordWrapper): # parallel octaves
    errors = []

    if (chord.next is not None):
        for a in range(len(chord.notes) - 1):
            for b in range(a+1, len(chord.notes)):
                if chord.melodic_intervals[a].name == "P1" and chord.melodic_intervals[b].name == "P1":
                    continue
                vlq = music21.voiceLeading.VoiceLeadingQuartet(chord.notes[a], chord.next.notes[a], chord.notes[b], chord.next.notes[b])
                if vlq.parallelUnisonOrOctave():
                    voices = [False] * 4
                    voices[a] = True
                    voices[b] = True
                    ErrorParams = {
                        'title': "Parallel Octaves",
                        'location': chord.location,
                        'description': f"{voice_names[a]} and {voice_names_lower[b]} form a parallel octave.",
                        'suggestion': "",
                        'voices': voices,
                        'duration': 2.0,
                        'link': "https://musictheory.pugetsound.edu/mt21c/ObjectionableParallels.html"
                    }
                    errors.append(e.Error(**ErrorParams))

    return errors

# test resolution of half/fully diminished seventh chords
def rule12(chord: mxp.ChordWrapper): # parallel fifths
    errors = []

    if (chord.next is not None):
        for a in range(len(chord.notes) - 1):
            for b in range(a+1, len(chord.notes)):
                if chord.melodic_intervals[a].name == "P1" and chord.melodic_intervals[b].name == "P1":
                    continue
                vlq = music21.voiceLeading.VoiceLeadingQuartet(chord.notes[a], chord.next.notes[a], chord.notes[b], chord.next.notes[b])
                if vlq.parallelFifth():
                    voices = [False] * 4
                    voices[a] = True
                    voices[b] = True
                    ErrorParams = {
                        'title': "Parallel Fifth",
                        'location': chord.location,
                        'description': f"{voice_names[a]} and {voice_names_lower[b]} form a parallel fifth.",
                        'suggestion': "",
                        'voices': voices,
                        'duration': 2.0,
                        'link': "https://musictheory.pugetsound.edu/mt21c/ObjectionableParallels.html"
                    }
                    errors.append(e.Error(**ErrorParams))

    return errors

def rule13(chord: mxp.ChordWrapper): # hidden fifths and octaves
    errors = []

    if (chord.next is not None):
        vlq = music21.voiceLeading.VoiceLeadingQuartet(chord.notes[0], chord.next.notes[0], chord.notes[3], chord.next.notes[3])
        if (vlq.hiddenInterval(music21.interval.Interval('P5'))
            or vlq.hiddenInterval(music21.interval.Interval('P8'))):
            if not vlq.contraryMotion() or not (chord.melodic_intervals[0].isStep or chord.melodic_intervals[0].name == "P1"):
                voices = [True, False, False, True]
                ErrorParams = {
                    'title': "Hidden Octave or Fifth",
                    'location': chord.location,
                    'description': f"Soprano and bass form a hidden octave or fifth.",
                    'suggestion': "",
                    'voices': voices,
                    'duration': 2.0,
                    'link': "https://stingmusik.se/files/sting_frtcktoktavkvint.pdf"
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
        errors.extend(check_rules_1_to_13(curr, sw))
        curr = curr.next

    for error in errors:
        print(error)