import music21 as m21
import music_generation.counterpoint_parser as cpp
import music_generation.counterpoint_rules as cpr
import music_generation.music21_method_extensions as m21me
import music_generation.counterpoint_generation as cpg
import music_analysis.music_xml_parser as mxp
import music_analysis.rules1to13 as r113
import music_analysis.rules14to26 as r1426
import music_analysis.rule27 as r27

# fn = "./music_generation/melody4.musicxml"
# fn1 = "./music_generation/melody2.musicxml"
# fn2 = "./music_generation/harmony2.musicxml"
# fn1 = "./music_generation/test_cases/rule10melody.musicxml"
# fn2 = "./music_generation/test_cases/rule10harmony.musicxml"
fn = "./music_analysis/voice-leading-1.musicxml"

if __name__ == '__main__':
    # m21me.extend()
    # cpg.generate_counterpoint(fn, 1)

    # sw = cpp.getScoreWrapper(fn1, 1)
    # cpp.testHarmony(sw, fn2)
    # errors = cpr.check_counterpoint(sw)
    # print(errors)

    sw = mxp.getScoreWrapper(fn)

    # errors = []
    # for cw in sw.chord_wrappers:
    #     errors.extend(r113.check_rules_1_to_13(cw, sw))
    #
    # for e in errors:
    #     print(e.title, e.location)
    
    #for c in sw.chord_wrappers:
        #print(c.location, c.chord_obj.fullName)
        #print(c.melodic_intervals)

    # chords iterated through by next pointer
    
    curr = sw.chord_wrappers[0]
    print(r27.check_rule_27(sw))
    while(curr is not None):
        print(curr, curr.inversion)
        errors = r1426.check_rules_14_to_26(curr, sw)
        errors.extend(r113.check_rules_1_to_13(curr, sw))
        for error in errors:
            print(error)
        curr = curr.next
    
    # sw.score.show()